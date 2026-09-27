import { useEffect, useMemo, useState, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from 'react';
import { useAuth, type AuthUser } from '@workspace/replit-auth-web';
import {
  AlertTriangle,
  Accessibility,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Compass,
  CreditCard,
  GraduationCap,
  Heart,
  HeartPulse,
  Hotel,
  Info,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Store,
  UtensilsCrossed,
  X,
} from 'lucide-react';

type Screen = 'home' | 'search' | 'results' | 'details' | 'saved' | 'feedback' | 'contribute' | 'profile';
type Category = 'Healthcare' | 'Education' | 'Government' | 'Banking' | 'Restaurants' | 'Businesses' | 'Hotels' | 'Other Services';
type VerificationStatus = 'Verified' | 'Community Reported' | 'Pending Verification';
type FeatureStatus = 'available' | 'limited' | 'unknown';
type Feature =
  | 'Sign-language proficient staff'
  | 'Written communication'
  | 'Visual communication'
  | 'Remote interpreting'
  | 'Accessible customer service'
  | 'Emergency communication support'
  | 'Deaf-awareness training';

type Place = {
  id: string;
  name: string;
  category: Category;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string[];
  features: Record<Feature, FeatureStatus>;
  about: string;
  verification: VerificationStatus;
  rating: number | null;
  reviewCount: number;
  sampleReviews: string[];
  reviewedDate: string;
};

type CommunityFeedback = {
  id: string;
  overall: number;
  communication: number;
  staffUnderstanding: number;
  text: string;
  createdAt: string;
};

type UserReview = CommunityFeedback & {
  userName: string;
};

type Profile = {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
};

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

type AccessibilityReport = {
  id: string;
  placeId: string;
  placeName: string;
  message: string;
  createdAt: string;
};

const features: Feature[] = [
  'Sign-language proficient staff',
  'Written communication',
  'Visual communication',
  'Remote interpreting',
  'Emergency communication support',
  'Deaf-awareness training',
  'Accessible customer service',
];

const searchFilters: Feature[] = [
  'Sign-language proficient staff',
  'Written communication',
  'Visual communication',
  'Remote interpreting',
  'Accessible customer service',
  'Emergency communication support',
];

const serviceCategories: Category[] = [
  'Healthcare',
  'Education',
  'Government',
  'Banking',
  'Restaurants',
  'Businesses',
  'Hotels',
  'Other Services',
];

const unknownFeatures = Object.fromEntries(features.map((feature) => [feature, 'unknown'])) as Record<Feature, FeatureStatus>;

function makePlace(place: Omit<Place, 'features'> & { features: Partial<Record<Feature, FeatureStatus>> }): Place {
  return { ...place, features: { ...unknownFeatures, ...place.features } };
}

const places: Place[] = [
  makePlace({
    id: 'hopecare',
    name: 'Sample HopeCare Health Centre',
    category: 'Healthcare',
    location: 'Kilimani, Nairobi',
    address: 'Demo listing · Kilimani, Nairobi',
    phone: '+254 700 000 101',
    email: 'hello@hopecare.example',
    website: 'hopecare.example',
    hours: ['Monday – Friday|8:00 AM – 6:00 PM', 'Saturday|9:00 AM – 1:00 PM', 'Sunday|Closed'],
    features: {
      'Sign-language proficient staff': 'available',
      'Written communication': 'available',
      'Visual communication': 'limited',
      'Remote interpreting': 'available',
      'Emergency communication support': 'limited',
      'Deaf-awareness training': 'available',
      'Accessible customer service': 'available',
    },
    about: 'A fictional community clinic created for the FindAble prototype. This sample listing demonstrates how visitors could review communication options before planning a visit.',
    verification: 'Verified',
    rating: 4.6,
    reviewCount: 32,
    sampleReviews: [
      'Staff were patient and allowed me to communicate through writing.',
      'The appointment instructions were clear and easy to follow.',
      'I knew what support to ask about before arriving.',
    ],
    reviewedDate: 'August 2026',
  }),
  makePlace({
    id: 'brightpath',
    name: 'Sample BrightPath Academy',
    category: 'Education',
    location: 'Westlands, Nairobi',
    address: 'Demo listing · Westlands, Nairobi',
    phone: '+254 700 000 102',
    email: 'office@brightpath.example',
    website: 'brightpath.example',
    hours: ['Monday – Friday|7:30 AM – 4:30 PM', 'Saturday|By appointment', 'Sunday|Closed'],
    features: {
      'Sign-language proficient staff': 'available',
      'Written communication': 'available',
      'Visual communication': 'available',
      'Remote interpreting': 'limited',
      'Deaf-awareness training': 'available',
      'Accessible customer service': 'limited',
    },
    about: 'A fictional school created for this prototype. Its sample listing demonstrates written family updates and communication planning for school meetings.',
    verification: 'Community Reported',
    rating: 4.3,
    reviewCount: 18,
    sampleReviews: [
      'Written updates made it easier to follow the school process.',
      'The front office took time to confirm how meetings would work.',
      'It was helpful to know what support to request in advance.',
    ],
    reviewedDate: 'August 2026',
  }),
  makePlace({
    id: 'community-access',
    name: 'Sample Civic Access Office',
    category: 'Government',
    location: 'City Centre, Nairobi',
    address: 'Demo listing · City Centre, Nairobi',
    phone: '+254 700 000 103',
    email: 'welcome@civicaccess.example',
    website: 'civicaccess.example',
    hours: ['Monday – Friday|8:30 AM – 4:00 PM', 'Saturday|Closed', 'Sunday|Closed'],
    features: {
      'Written communication': 'available',
      'Visual communication': 'available',
      'Remote interpreting': 'limited',
      'Emergency communication support': 'limited',
      'Accessible customer service': 'available',
    },
    about: 'A fictional public-service office for demonstrating how government service access information could be organized.',
    verification: 'Pending Verification',
    rating: 4.4,
    reviewCount: 9,
    sampleReviews: [
      'The service steps were easier to understand in writing.',
      'I was able to ask questions at my own pace.',
      'The process felt clearer after I knew what to expect.',
    ],
    reviewedDate: 'August 2026',
  }),
  makePlace({
    id: 'harborline-bank',
    name: 'Sample Harborline Bank',
    category: 'Banking',
    location: 'Upper Hill, Nairobi',
    address: 'Demo listing · Upper Hill, Nairobi',
    phone: '+254 700 000 104',
    email: 'help@harborline.example',
    website: 'harborline.example',
    hours: ['Monday – Friday|9:00 AM – 4:00 PM', 'Saturday|9:00 AM – 12:00 PM', 'Sunday|Closed'],
    features: {
      'Written communication': 'available',
      'Visual communication': 'limited',
      'Remote interpreting': 'available',
      'Emergency communication support': 'unknown',
      'Accessible customer service': 'available',
    },
    about: 'A fictional bank listing that demonstrates how users could check for accessible customer-service options before visiting a branch.',
    verification: 'Community Reported',
    rating: 4.1,
    reviewCount: 14,
    sampleReviews: [
      'The staff explained the next steps in writing.',
      'It helped to know remote interpreting could be requested.',
      'The service desk was patient while I read the forms.',
    ],
    reviewedDate: 'August 2026',
  }),
  makePlace({
    id: 'juniper-table',
    name: 'Sample Juniper Table',
    category: 'Restaurants',
    location: 'Kileleshwa, Nairobi',
    address: 'Demo listing · Kileleshwa, Nairobi',
    phone: '+254 700 000 105',
    email: 'hello@junipertable.example',
    website: 'junipertable.example',
    hours: ['Monday – Saturday|10:00 AM – 10:00 PM', 'Sunday|10:00 AM – 8:00 PM'],
    features: {
      'Written communication': 'available',
      'Visual communication': 'available',
      'Deaf-awareness training': 'limited',
      'Accessible customer service': 'limited',
    },
    about: 'A fictional restaurant listing for the FindAble prototype. Sample access information highlights options like written ordering and visual menus.',
    verification: 'Pending Verification',
    rating: 4.2,
    reviewCount: 21,
    sampleReviews: [
      'The visual menu made it easier to choose.',
      'Staff were happy to take my order in writing.',
      'The table service instructions were straightforward.',
    ],
    reviewedDate: 'August 2026',
  }),
  makePlace({
    id: 'northstar-market',
    name: 'Sample Northstar Market',
    category: 'Businesses',
    location: 'Lavington, Nairobi',
    address: 'Demo listing · Lavington, Nairobi',
    phone: '+254 700 000 106',
    email: 'support@northstarmarket.example',
    website: 'northstarmarket.example',
    hours: ['Monday – Saturday|8:00 AM – 8:00 PM', 'Sunday|10:00 AM – 5:00 PM'],
    features: {
      'Sign-language proficient staff': 'limited',
      'Written communication': 'available',
      'Visual communication': 'available',
      'Deaf-awareness training': 'available',
      'Accessible customer service': 'available',
    },
    about: 'A fictional retail business. This sample entry demonstrates customer-service access information for everyday shopping.',
    verification: 'Verified',
    rating: 4.7,
    reviewCount: 27,
    sampleReviews: [
      'The checkout team used a notepad when I needed it.',
      'Clear signs helped me find the service counter.',
      'Staff checked in with me without rushing.',
    ],
    reviewedDate: 'August 2026',
  }),
  makePlace({
    id: 'sundown-lodge',
    name: 'Sample Sundown Lodge',
    category: 'Hotels',
    location: 'Karen, Nairobi',
    address: 'Demo listing · Karen, Nairobi',
    phone: '+254 700 000 107',
    email: 'stay@sundownlodge.example',
    website: 'sundownlodge.example',
    hours: ['Reception|Open 24 hours', 'Check-in|From 2:00 PM', 'Check-out|By 11:00 AM'],
    features: {
      'Written communication': 'available',
      'Visual communication': 'available',
      'Remote interpreting': 'limited',
      'Emergency communication support': 'available',
      'Deaf-awareness training': 'limited',
      'Accessible customer service': 'available',
    },
    about: 'A fictional hotel listing for demonstrating how travelers could review communication and emergency information before booking.',
    verification: 'Community Reported',
    rating: 4.5,
    reviewCount: 16,
    sampleReviews: [
      'Written check-in information made arrival easier.',
      'The team showed me the visual emergency instructions.',
      'It was useful to ask about support before booking.',
    ],
    reviewedDate: 'August 2026',
  }),
  makePlace({
    id: 'clearpath-resource-hub',
    name: 'Sample ClearPath Resource Hub',
    category: 'Other Services',
    location: 'Parklands, Nairobi',
    address: 'Demo listing · Parklands, Nairobi',
    phone: '+254 700 000 108',
    email: 'hello@clearpath.example',
    website: 'clearpath.example',
    hours: ['Monday – Friday|9:00 AM – 5:00 PM', 'Saturday|By appointment', 'Sunday|Closed'],
    features: {
      'Sign-language proficient staff': 'limited',
      'Written communication': 'available',
      'Visual communication': 'available',
      'Remote interpreting': 'available',
      'Deaf-awareness training': 'limited',
      'Accessible customer service': 'available',
    },
    about: 'A fictional community resource hub for the FindAble prototype. Its sample profile shows how organizations could explain communication support.',
    verification: 'Pending Verification',
    rating: 4.0,
    reviewCount: 7,
    sampleReviews: [
      'The resource list was easy to read.',
      'I could check communication options before the visit.',
      'Staff allowed extra time for questions.',
    ],
    reviewedDate: 'August 2026',
  }),
];

const categoryDetails: { label: string; value: Category; icon: ReactNode; description: string }[] = [
  { label: 'Healthcare', value: 'Healthcare', icon: <HeartPulse size={19} strokeWidth={2.1} />, description: 'Clinics and care' },
  { label: 'Education', value: 'Education', icon: <GraduationCap size={19} strokeWidth={2.1} />, description: 'Schools and learning' },
  { label: 'Government', value: 'Government', icon: <Landmark size={19} strokeWidth={2.1} />, description: 'Public services' },
  { label: 'Banking', value: 'Banking', icon: <CreditCard size={19} strokeWidth={2.1} />, description: 'Branches and services' },
  { label: 'Restaurants', value: 'Restaurants', icon: <UtensilsCrossed size={19} strokeWidth={2.1} />, description: 'Food and dining' },
  { label: 'Businesses', value: 'Businesses', icon: <Store size={19} strokeWidth={2.1} />, description: 'Everyday places' },
  { label: 'Hotels', value: 'Hotels', icon: <Hotel size={19} strokeWidth={2.1} />, description: 'Places to stay' },
  { label: 'More', value: 'Other Services', icon: <MoreHorizontal size={19} strokeWidth={2.1} />, description: 'More services' },
];

const verificationCopy: Record<VerificationStatus, string> = {
  Verified: "Accessibility information has been reviewed through FindAble's verification process.",
  'Community Reported': 'Accessibility information has been submitted by the FindAble community and has not yet received full verification.',
  'Pending Verification': 'Accessibility information is currently being reviewed.',
};

const statusCopy: Record<FeatureStatus, { mark: string; label: string }> = {
  available: { mark: '✓', label: 'Available' },
  limited: { mark: '⚠', label: 'Limited' },
  unknown: { mark: '—', label: 'Information unavailable' },
};

const accessibilityFeatureList: Feature[] = [
  'Sign-language proficient staff',
  'Written communication',
  'Visual communication',
  'Remote interpreting',
  'Emergency communication support',
  'Deaf-awareness training',
];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function useStoredState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}

function Header({ navigate, auth }: { navigate: (screen: Screen) => void; auth: AuthState }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (screen: Screen) => {
    navigate(screen);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <button className="brand" onClick={() => go('home')} aria-label="Go to FindAble home">
        <span className="brand-mark" aria-hidden="true"><Accessibility size={21} /></span>
        <span className="brand-name">FindAble</span>
      </button>
      <nav className={`header-links${menuOpen ? ' menu-open' : ''}`} aria-label="Main navigation">
        <button className="header-link" onClick={() => go('home')}>Home</button>
        <button className="header-link" onClick={() => go('search')}>Discover</button>
        <button className="header-link" onClick={() => go('saved')}>Saved places</button>
        <button className="header-link" onClick={() => go('contribute')}>Contribute</button>
        <button className="pill-button" onClick={() => go('search')}><Compass size={16} /> Nairobi, Kenya</button>
        {auth.isLoading ? <span className="account-loading" aria-label="Checking account status">Checking account…</span> : auth.isAuthenticated ? <button className="account-control" onClick={() => go('profile')}><span className="account-avatar">{(auth.user?.firstName ?? auth.user?.email ?? 'F').slice(0, 1).toUpperCase()}</span><span>{auth.user?.firstName || 'Account'}</span></button> : <><button className="header-link auth-link" onClick={auth.login}>Log in</button><button className="small-primary-button" onClick={auth.login}>Sign up</button></>}
        <button className="mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </nav>
    </header>
  );
}

function Footer() {
  return <footer className="footer">FindAble is a prototype for discovering communication access. Every institution, verification state, rating, and review shown here is demo content and has not been independently verified.</footer>;
}

function Breadcrumb({ onBack, label = 'Back' }: { onBack: () => void; label?: string }) {
  return <button className="breadcrumb" onClick={onBack}><ArrowLeft size={15} /> {label}</button>;
}

function Home({
  query,
  setQuery,
  onSearch,
  onCategory,
  onLocation,
  navigate,
}: {
  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;
  onCategory: (category: Category) => void;
  onLocation: () => void;
  navigate: (screen: Screen) => void;
}) {
  return (
    <>
      <main className="page-wrap">
        <section className="hero" aria-labelledby="home-title">
          <div>
            <div className="eyebrow">Plan your visit with more confidence</div>
            <h1 id="home-title" className="display">Find a place where you&apos;ll be understood.</h1>
            <p className="hero-copy">Discover businesses, healthcare facilities, schools, government offices and other institutions with accessibility information for Deaf users.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigate('search')}>Search accessible services <ArrowRight size={17} /></button>
              <button className="outline-button" onClick={() => navigate('contribute')}>Contribute to FindAble</button>
            </div>
          </div>
          <div className="hero-visual" aria-label="Illustration of finding a place in Nairobi">
            <div className="visual-card">
              <div className="visual-top"><span className="eyebrow">Your nearby guide</span><MapPin size={19} color="#c15c49" /></div>
              <div className="visual-map"><span className="map-pin"><MapPin size={17} /></span></div>
              <div className="visual-lines"><span className="visual-line" /><span className="visual-line short" /></div>
            </div>
          </div>
        </section>

        <section className="service-search" aria-labelledby="quick-search-title">
          <div className="search-label"><span id="quick-search-title">What service are you looking for?</span><button type="button" className="location-control" onClick={onLocation}><MapPin size={15} /> Use my location</button></div>
          <div className="search-row">
            <div className="search-input-wrap">
              <Search size={18} aria-hidden="true" />
              <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onSearch(); }} placeholder="Search by place, service or category" aria-label="Search for a service" />
            </div>
            <button className="primary-button" onClick={onSearch}>Search <ArrowRight size={16} /></button>
          </div>
        </section>

        <section aria-labelledby="categories-title">
          <div className="section-heading">
            <div><div className="eyebrow">Browse by need</div><h2 id="categories-title" className="display">What are you looking for?</h2></div>
            <button className="ghost-button" onClick={() => navigate('search')}>View all services <ChevronRight size={16} /></button>
          </div>
          <div className="category-grid">
            {categoryDetails.map((category) => (
              <button className="category-card" key={category.label} onClick={() => onCategory(category.value)}>
                <span className="category-icon">{category.icon}</span>
                <span><h3>{category.label}</h3><span style={{ color: '#718079', fontSize: 12 }}>{category.description}</span></span>
              </button>
            ))}
          </div>
        </section>

        <div className="home-note">
          <Info className="note-icon" size={25} />
          <div><strong>Accessibility information before you arrive</strong><p>FindAble helps Deaf people discover, evaluate, and compare institutions before visiting. Prototype statuses, ratings, and feedback show how the platform could work; they are not real-world claims.</p></div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SearchPage({
  query,
  setQuery,
  category,
  setCategory,
  selectedFeatures,
  toggleFeature,
  onSubmit,
  onBack,
}: {
  query: string;
  setQuery: (value: string) => void;
  category: Category | '';
  setCategory: (value: Category | '') => void;
  selectedFeatures: Feature[];
  toggleFeature: (feature: Feature) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <main className="page-wrap app-main">
      <Breadcrumb onBack={onBack} />
      <div className="eyebrow" style={{ marginTop: 25 }}>Search the guide</div>
      <h1 className="page-title display">Discover accessible services</h1>
      <p className="page-intro">Search sample institutions by name, location, or category, then compare the communication options they list.</p>
      <div className="filter-panel">
        <div className="service-search" style={{ margin: 0, maxWidth: 'none' }}>
          <label className="search-label" htmlFor="service-search">Search by place or service</label>
          <div className="search-input-wrap"><Search size={18} aria-hidden="true" /><input id="service-search" className="search-input search-large" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “clinic” or “Westlands”" /></div>
          <div className="search-label" style={{ marginTop: 18 }}>What type of service do you need?</div>
          <div className="category-picker" role="group" aria-label="Choose a service category">
            <button type="button" className={`category-option${category === '' ? ' selected' : ''}`} aria-pressed={category === ''} onClick={() => { setCategory(''); onSubmit(); }}>All services</button>
            {serviceCategories.map((serviceCategory) => <button type="button" key={serviceCategory} className={`category-option${category === serviceCategory ? ' selected' : ''}`} aria-pressed={category === serviceCategory} onClick={() => { setCategory(serviceCategory); onSubmit(); }}>{serviceCategory}</button>)}
          </div>
          <button className="primary-button" style={{ width: '100%' }} onClick={onSubmit}>Show accessible places <ArrowRight size={17} /></button>
        </div>
        <fieldset className="filter-box">
          <legend>What accessibility do you need?</legend>
          <p className="filter-title" style={{ fontWeight: 400, color: '#718079', fontSize: 13, marginTop: -5 }}>Results must match every selected support need.</p>
          <div className="filter-list">
            {searchFilters.map((feature) => <label className="check-label" key={feature}><input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => toggleFeature(feature)} /> <span>{feature}</span></label>)}
          </div>
        </fieldset>
      </div>
    </main>
  );
}

function VerificationBadge({ status }: { status: VerificationStatus }) {
  const icon = status === 'Verified' ? <BadgeCheck size={15} /> : status === 'Community Reported' ? <MessageSquareText size={15} /> : <Clock3 size={15} />;
  return <span className={`verification-badge verification-${status.toLowerCase().replaceAll(' ', '-')}`}>{icon}<span>{status}</span></span>;
}

function AccessibilityLegend() {
  return (
    <div className="accessibility-legend" aria-label="Accessibility indicators">
      <strong>Accessibility indicators</strong>
      <span><span className="indicator-mark available-mark">✓</span> Available</span>
      <span><span className="indicator-mark limited-mark">⚠</span> Limited</span>
      <span><span className="indicator-mark unknown-mark">—</span> Information unavailable</span>
    </div>
  );
}

function FeatureIndicator({ status }: { status: FeatureStatus }) {
  const details = statusCopy[status];
  return <span className={`feature-indicator indicator-${status}`}><span aria-hidden="true">{details.mark}</span> {details.label}</span>;
}

function ResultCard({
  place,
  open,
  isSaved,
  onToggleSaved,
  compared = false,
  onToggleCompare,
}: {
  place: Place;
  open: () => void;
  isSaved: boolean;
  onToggleSaved: () => void;
  compared?: boolean;
  onToggleCompare?: () => void;
}) {
  const shownFeatures = Object.entries(place.features)
    .filter(([, status]) => status !== 'unknown')
    .slice(0, 4) as [Feature, FeatureStatus][];

  return (
    <article className="result-card">
      <div className="result-card-main">
        <div className="result-title-row">
          <div>
            <span className="eyebrow">{place.category}</span>
            <h3>{place.name}</h3>
          </div>
          <VerificationBadge status={place.verification} />
        </div>
        <div className="result-meta"><span><MapPin size={14} />{place.location}</span></div>
        <p className="result-access-label">Accessibility information</p>
        <div className="feature-row">
          {shownFeatures.length ? shownFeatures.map(([feature, status]) => <span className={`feature-tag tag-${status}`} key={feature}><span aria-hidden="true">{statusCopy[status].mark}</span>{feature}</span>) : <span className="form-hint">No accessibility features have been reported yet.</span>}
        </div>
        <div className="rating-summary">
          {place.rating === null ? <span>No community rating yet</span> : <><span className="rating-stars" aria-label={`Demo community rating ${place.rating} out of 5`}><Star size={15} fill="currentColor" /> {place.rating.toFixed(1)}</span><span>{place.reviewCount} community reviews <span className="demo-inline-label">DEMO</span></span></>}
        </div>
      </div>
      <div className="result-actions">
        <button className="primary-button" onClick={open}>View Profile <ArrowRight size={16} /></button>
        <button className="outline-button save-button" aria-pressed={isSaved} onClick={onToggleSaved}><Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />{isSaved ? 'Saved' : 'Save'}</button>
        {onToggleCompare && <button className={`compare-button${compared ? ' selected' : ''}`} aria-pressed={compared} onClick={onToggleCompare}>{compared ? 'Selected to compare' : 'Compare'}</button>}
      </div>
    </article>
  );
}

function Results({
  query,
  setQuery,
  category,
  setCategory,
  selectedFeatures,
  toggleFeature,
  filteredPlaces,
  openPlace,
  savedIds,
  toggleSaved,
  comparisonIds,
  toggleComparison,
  comparisonOpen,
  setComparisonOpen,
  onBack,
}: {
  query: string;
  setQuery: (value: string) => void;
  category: Category | '';
  setCategory: (value: Category | '') => void;
  selectedFeatures: Feature[];
  toggleFeature: (feature: Feature) => void;
  filteredPlaces: Place[];
  openPlace: (place: Place) => void;
  savedIds: string[];
  toggleSaved: (place: Place) => void;
  comparisonIds: string[];
  toggleComparison: (place: Place) => void;
  comparisonOpen: boolean;
  setComparisonOpen: (open: boolean) => void;
  onBack: () => void;
}) {
  const comparisonPlaces = filteredPlaces.filter((place) => comparisonIds.includes(place.id));
  return (
    <main className="page-wrap app-main">
      <Breadcrumb onBack={onBack} label="Back to search" />
      <div className="eyebrow" style={{ marginTop: 25 }}>Accessible places in Nairobi</div>
      <h1 className="page-title display">Accessible places</h1>
      <p className="page-intro">Compare communication support, verification status, and demo community feedback. Confirm details with a place before visiting.</p>
      <div className="filter-panel results-filter-panel" style={{ marginTop: 27 }}>
        <div className="results-refine">
          <div className="search-input-wrap"><Search size={18} aria-hidden="true" /><input className="search-input search-large" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, location, or category" aria-label="Search by institution name, location, or category" /></div>
          <select aria-label="Filter by category" className="category-select" value={category} onChange={(event) => setCategory(event.target.value as Category | '')}>
            <option value="">All categories</option>{serviceCategories.map((serviceCategory) => <option value={serviceCategory} key={serviceCategory}>{serviceCategory}</option>)}
          </select>
          <fieldset className="filter-box" style={{ padding: '15px 18px' }}>
            <legend>What accessibility do you need?</legend>
            <div className="filter-list">{searchFilters.map((feature) => <label className="check-label" key={feature}><input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => toggleFeature(feature)} /> <span>{feature}</span></label>)}</div>
          </fieldset>
        </div>
      </div>
      <AccessibilityLegend />
      <div className="results-toolbar"><div><h2>{filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found</h2><span className="sample-label">DEMO DATA · NOT REAL-WORLD VERIFICATION</span></div><span className="location"><MapPin size={14} /> Nairobi, Kenya</span></div>
      <div className="comparison-toolbar">
        <span>{comparisonIds.length} of 2 places selected to compare</span>
        <div><button className="compare-button" disabled={comparisonIds.length < 2} onClick={() => setComparisonOpen(!comparisonOpen)}>{comparisonOpen ? 'Hide comparison' : 'Compare selected'}</button><button className="text-button" disabled={!comparisonIds.length} onClick={() => { comparisonIds.forEach((id) => { const place = filteredPlaces.find((item) => item.id === id); if (place) toggleComparison(place); }); setComparisonOpen(false); }}>Clear</button></div>
      </div>
      {comparisonOpen && comparisonPlaces.length === 2 && <div className="comparison-table-wrap"><table className="comparison-table"><caption>Prototype accessibility comparison</caption><thead><tr><th scope="col">Accessibility detail</th>{comparisonPlaces.map((place) => <th scope="col" key={place.id}>{place.name}</th>)}</tr></thead><tbody>
        <tr><th scope="row">Category</th>{comparisonPlaces.map((place) => <td key={place.id}>{place.category}</td>)}</tr>
        <tr><th scope="row">Verification</th>{comparisonPlaces.map((place) => <td key={place.id}><VerificationBadge status={place.verification} /></td>)}</tr>
        {accessibilityFeatureList.map((feature) => <tr key={feature}><th scope="row">{feature}</th>{comparisonPlaces.map((place) => <td key={place.id}><FeatureIndicator status={place.features[feature]} /></td>)}</tr>)}
        <tr><th scope="row">Community rating</th>{comparisonPlaces.map((place) => <td key={place.id}>{place.rating === null ? 'No rating yet' : `${place.rating.toFixed(1)} · ${place.reviewCount} demo reviews`}</td>)}</tr>
      </tbody></table></div>}
      <div className="result-list">
        {filteredPlaces.length ? filteredPlaces.map((place) => <ResultCard place={place} open={() => openPlace(place)} isSaved={savedIds.includes(place.id)} onToggleSaved={() => toggleSaved(place)} compared={comparisonIds.includes(place.id)} onToggleCompare={() => toggleComparison(place)} key={place.id} />) : <div className="empty-state"><Search size={29} /><h2>No places match those filters</h2><p>Try another category or remove one of the communication support filters.</p></div>}
      </div>
    </main>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return <span className="rating-stars" aria-label={`${rating.toFixed(1)} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < Math.round(rating) ? 'currentColor' : 'none'} />)} <strong>{rating.toFixed(1)}</strong></span>;
}

function Details({
  place,
  feedback,
  reviews,
  isSaved,
  onToggleSaved,
  onBack,
  onDirections,
  onContact,
  onReport,
  onFeedback,
}: {
  place: Place;
  feedback: CommunityFeedback[];
  reviews: UserReview[];
  isSaved: boolean;
  onToggleSaved: () => void;
  onBack: () => void;
  onDirections: () => void;
  onContact: () => void;
  onReport: () => void;
  onFeedback: () => void;
}) {
  const allUserFeedback = [...feedback, ...reviews];
  const ratingCount = (place.rating === null ? 0 : place.reviewCount) + allUserFeedback.length;
  const ratingValue = ratingCount === 0 ? null : (
    ((place.rating ?? 0) * (place.rating === null ? 0 : place.reviewCount) + allUserFeedback.reduce((sum, item) => sum + item.overall, 0)) / ratingCount
  );

  return (
    <main className="page-wrap app-main">
      <Breadcrumb onBack={onBack} label="Back to results" />
      <div className="profile-heading">
        <div className="detail-kicker"><Accessibility size={15} /> Accessibility profile · demo listing</div>
        <h1 className="display">{place.name}</h1>
        <div className="profile-meta"><span>{place.category}</span><span><MapPin size={15} />{place.location}</span></div>
        <VerificationBadge status={place.verification} />
        <p className="verification-explanation">{verificationCopy[place.verification]} <strong>Prototype state only — no real institution verification has taken place.</strong></p>
      </div>
      <div className="detail-layout">
        <article className="detail-main">
          <div className="prototype-warning"><Info size={18} /><span>This is fictional demo data. Support options, status, rating, and feedback are not claims about a real institution.</span></div>
          <div className="detail-section accessibility-primary">
            <div className="section-title-row"><div><div className="eyebrow">Plan your visit</div><h2>Accessibility at this institution</h2></div><ShieldCheck size={23} /></div>
            <p className="about-copy">Each indicator describes what this sample profile lists. Information unavailable does not mean a feature is not accessible.</p>
            <AccessibilityLegend />
            <div className="accessibility-table">
              {accessibilityFeatureList.map((feature) => <div className="accessibility-row" key={feature}><strong>{feature}</strong><FeatureIndicator status={place.features[feature]} /></div>)}
            </div>
            <p className="accessibility-note"><strong>Also listed:</strong> Accessible customer service — <FeatureIndicator status={place.features['Accessible customer service']} /></p>
          </div>
          <div className="detail-section trust-section">
            <div className="eyebrow">Prototype trust signals</div>
            <h2>Why is this information trusted?</h2>
            <p className="about-copy">These sample indicators demonstrate how FindAble could explain information quality. They do not represent a real review or audit.</p>
            <ul className="trust-list">
              <li><CheckCircle2 size={17} /><span>Institution accessibility information submitted <strong>DEMO</strong></span></li>
              <li><CheckCircle2 size={17} /><span>Community feedback received <strong>SAMPLE</strong></span></li>
              <li><CheckCircle2 size={17} /><span>{place.verification === 'Verified' ? 'Accessibility information reviewed' : 'Review status'} <strong>{place.verification}</strong></span></li>
            </ul>
            <p className="reviewed-date">Sample review date: {place.reviewedDate} · demo only</p>
            <p className="verification-explanation">{verificationCopy[place.verification]}</p>
          </div>
          <div className="detail-section">
            <div className="section-title-row"><div><div className="eyebrow">Community feedback</div><h2>Experiences shared</h2></div><MessageSquareText size={22} /></div>
            <div className="community-rating">
              {ratingValue === null ? <><strong>No community rating yet</strong><span>Be the first to share your experience.</span></> : <><div className="community-rating-score"><RatingStars rating={ratingValue} /><strong>Based on {ratingCount} {ratingCount === 1 ? 'review' : 'community reviews'}</strong><span className="demo-inline-label">DEMO + MEMBER REVIEWS</span></div><div className="rating-breakdown"><span>Communication <RatingStars rating={allUserFeedback.length ? allUserFeedback.reduce((sum, item) => sum + item.communication, 0) / allUserFeedback.length : Math.max(1, (place.rating ?? 0) - 0.1)} /></span><span>Staff understanding <RatingStars rating={allUserFeedback.length ? allUserFeedback.reduce((sum, item) => sum + item.staffUnderstanding, 0) / allUserFeedback.length : Math.max(1, (place.rating ?? 0) - 0.2)} /></span><span>Overall experience <RatingStars rating={ratingValue} /></span></div></>}
            </div>
            <div className="review-list">
              {place.sampleReviews.map((review, index) => <blockquote className="review-card" key={`${place.id}-demo-${index}`}><span className="review-demo-label">SAMPLE REVIEW · NOT REAL TESTIMONY</span><p>“{review}”</p></blockquote>)}
              {feedback.map((item) => <blockquote className="review-card local-review-card" key={item.id}><span className="review-demo-label">LOCAL PROTOTYPE FEEDBACK</span><RatingStars rating={item.overall} /><p>“{item.text}”</p></blockquote>)}
              {reviews.map((item) => <blockquote className="review-card member-review-card" key={item.id}><span className="member-review-label">{item.userName} · {new Date(item.createdAt).toLocaleDateString()}</span><RatingStars rating={item.overall} /><p>“{item.text}”</p></blockquote>)}
            </div>
            <button className="outline-button feedback-cta" onClick={onFeedback}><MessageSquareText size={16} /> Leave a review</button>
          </div>
          <div className="detail-section"><h2>About this place</h2><p className="about-copy">{place.about}</p></div>
          <div className="detail-section"><h2>Contact and hours</h2><div className="contact-list"><span className="contact-item"><Phone size={16} /> {place.phone}</span><span className="contact-item"><Mail size={16} /> {place.email}</span><span className="contact-item"><Building2 size={16} /> {place.website}</span></div>{place.hours.map((hour) => { const [day, time] = hour.split('|'); return <div className="hours-row" key={day}><span>{day}</span><strong>{time}</strong></div>; })}</div>
        </article>
        <aside className="detail-side">
          <div className="eyebrow">Next steps</div><h2>Make a plan that works for you</h2>
          <p className="about-copy" style={{ fontSize: 13 }}>Save this sample place or check the contact and directions options.</p>
          <div className="side-actions">
            <button className={`primary-button${isSaved ? ' saved-primary' : ''}`} aria-pressed={isSaved} onClick={onToggleSaved}><Heart size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved place' : 'Save place'}</button>
            <button className="outline-button" onClick={onDirections}><Navigation size={16} /> Get directions</button>
            <button className="outline-button" onClick={onContact}><Phone size={16} /> Contact institution</button>
            <button className="outline-button" onClick={onFeedback}><MessageSquareText size={16} /> Leave a review</button>
            <button className="report-link" onClick={onReport}><CircleAlert size={14} /> Report incorrect information</button>
          </div>
          <p className="sample-contact-note">All contact details in this profile are fictional demo values.</p>
        </aside>
      </div>
    </main>
  );
}

function SavedPlaces({
  savedPlaces,
  savedIds,
  toggleSaved,
  openPlace,
  onDiscover,
  isAuthenticated,
  onLogin,
}: {
  savedPlaces: Place[];
  savedIds: string[];
  toggleSaved: (place: Place) => void;
  openPlace: (place: Place) => void;
  onDiscover: () => void;
  isAuthenticated: boolean;
  onLogin: () => void;
}) {
  if (!isAuthenticated) {
    return (
      <main className="page-wrap app-main">
        <div className="eyebrow" style={{ marginTop: 25 }}>Your shortlist</div>
        <h1 className="page-title display">Saved places</h1>
        <div className="empty-state account-empty-state"><Heart size={30} /><h2>Save places to your account.</h2><p>Log in to keep your shortlist available when you come back.</p><button className="primary-button" onClick={onLogin}>Log in to save places <ArrowRight size={16} /></button><button className="text-button" onClick={onDiscover}>Continue discovering</button></div>
      </main>
    );
  }
  return (
    <main className="page-wrap app-main">
      <div className="eyebrow" style={{ marginTop: 25 }}>Your shortlist</div>
      <h1 className="page-title display">Saved places</h1>
      <p className="page-intro">Keep useful places together so you can find their accessibility information again.</p>
      <div className="result-list saved-result-list">
        {savedPlaces.length ? savedPlaces.map((place) => <ResultCard key={place.id} place={place} open={() => openPlace(place)} isSaved={savedIds.includes(place.id)} onToggleSaved={() => toggleSaved(place)} />) : <div className="empty-state"><Heart size={30} /><h2>No saved places yet.</h2><p>Save accessible places here so you can find them quickly later.</p><button className="primary-button" onClick={onDiscover}>Discover places <ArrowRight size={16} /></button></div>}
      </div>
    </main>
  );
}

function AuthPrompt({ kind, onClose, onLogin }: { kind: "save" | "review"; onClose: () => void; onLogin: () => void }) {
  const isReview = kind === "review";
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="prototype-dialog auth-prompt" role="dialog" aria-modal="true" aria-labelledby="auth-prompt-title">
        <button className="dialog-close" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        <div className="dialog-icon"><ShieldCheck size={22} /></div>
        <div className="eyebrow">Personal FindAble features</div>
        <h2 id="auth-prompt-title">{isReview ? "Log in to share your experience." : "Create an account to save places and access them later."}</h2>
        <p className="about-copy">{isReview ? "Your name will appear with your review. Browsing and reading reviews stays open to everyone." : "Keep your saved institutions private to your account while continuing to browse without signing in."}</p>
        <div className="form-actions auth-prompt-actions"><button className="primary-button" onClick={onLogin}>Log in</button><button className="outline-button" onClick={onLogin}>Create account</button></div>
      </section>
    </div>
  );
}

function ProfilePage({ profile, savedCount, onSaved, onLogout }: { profile: Profile | null; savedCount: number; onSaved: () => void; onLogout: () => void }) {
  return (
    <main className="page-wrap app-main">
      <div className="form-shell profile-page">
        <div className="eyebrow">Your account</div>
        <h1 className="page-title display">My Profile</h1>
        {profile ? <div className="profile-card form-card">
          <div className="profile-avatar-large">{profile.name.slice(0, 1).toUpperCase()}</div>
          <div className="profile-data"><div><span className="profile-label">Name</span><strong>{profile.name}</strong></div><div><span className="profile-label">Email</span><strong>{profile.email ?? "Email provided by your sign-in account"}</strong></div><div><span className="profile-label">Account created</span><strong>{new Date(profile.createdAt).toLocaleDateString()}</strong></div></div>
          <div className="profile-actions"><button className="outline-button" onClick={onSaved}>Saved places <span className="count-pill">{savedCount}</span></button><button className="text-button" onClick={onLogout}>Log out</button></div>
        </div> : <div className="form-card"><p className="about-copy">Loading your account…</p></div>}
      </div>
    </main>
  );
}

function RatingControl({ label, value, onChange }: { label: string; value: number; onChange: (rating: number) => void }) {
  return (
    <fieldset className="rating-control">
      <legend>{label}</legend>
      <div role="group" aria-label={`${label}, ${value} out of 5 selected`}>
        {[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" className={rating <= value ? 'rating-choice chosen' : 'rating-choice'} aria-label={`${rating} out of 5`} aria-pressed={rating === value} onClick={() => onChange(rating)}><Star size={22} fill={rating <= value ? 'currentColor' : 'none'} /></button>)}
      </div>
      <span className="form-hint">{value} out of 5</span>
    </fieldset>
  );
}

function FeedbackPage({ place, onCancel, onSubmit }: { place: Place; onCancel: () => void; onSubmit: (feedback: CommunityFeedback) => void | Promise<void> }) {
  const [overall, setOverall] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [staffUnderstanding, setStaffUnderstanding] = useState(5);
  const [text, setText] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ id: createId('feedback'), overall, communication, staffUnderstanding, text: text.trim(), createdAt: new Date().toISOString() });
  };

  return (
    <main className="page-wrap app-main">
      <Breadcrumb onBack={onCancel} label={`Back to ${place.name}`} />
      <div className="form-shell">
        <div className="eyebrow">Community review · signed-in members</div>
        <h1 className="page-title display">Share your experience</h1>
        <p className="page-intro">Your review will show your account name and the date it was shared. It will not verify any accessibility claim.</p>
        <form className="form-card" onSubmit={submit}>
          <div className="feedback-place"><strong>{place.name}</strong><span>{place.category} · {place.location}</span></div>
          <RatingControl label="Overall experience" value={overall} onChange={setOverall} />
          <RatingControl label="Communication" value={communication} onChange={setCommunication} />
          <RatingControl label="Staff understanding" value={staffUnderstanding} onChange={setStaffUnderstanding} />
          <div className="field"><label htmlFor="feedback-text">Written feedback</label><textarea id="feedback-text" required minLength={5} maxLength={800} value={text} onChange={(event) => setText(event.target.value)} placeholder="What would help someone plan a visit here?" /><span className="form-hint">{text.length}/800 characters</span></div>
          <div className="form-foot"><span className="form-hint">Member reviews are community experiences, not institution verification.</span><button className="primary-button" type="submit">Submit review <ArrowRight size={16} /></button></div>
        </form>
      </div>
    </main>
  );
}

type ContributionMode = 'choose' | 'add' | 'report';

function Contribution({
  mode,
  setMode,
  reportTarget,
  allPlaces,
  onBack,
  onReturnHome,
  submittedMode,
  setSubmittedMode,
  submitPlace,
  submitReport,
}: {
  mode: ContributionMode;
  setMode: (mode: ContributionMode) => void;
  reportTarget: Place | null;
  allPlaces: Place[];
  onBack: () => void;
  onReturnHome: () => void;
  submittedMode: 'suggestion' | 'report' | null;
  setSubmittedMode: (value: 'suggestion' | 'report' | null) => void;
  submitPlace: (place: Place) => void;
  submitReport: (place: Place, message: string) => void;
}) {
  const [form, setForm] = useState({ name: '', contact: '', website: '', address: '', category: '' as Category | '', notes: '' });
  const [formFeatures, setFormFeatures] = useState<Feature[]>([]);
  const [targetId, setTargetId] = useState(reportTarget?.id ?? '');
  const [reportMessage, setReportMessage] = useState('');

  useEffect(() => {
    if (reportTarget) {
      setTargetId(reportTarget.id);
      setMode('report');
    }
  }, [reportTarget, setMode]);

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const toggle = (feature: Feature) => setFormFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  const selectedTarget = allPlaces.find((place) => place.id === targetId) ?? null;
  const submitSuggestion = (event: FormEvent) => {
    event.preventDefault();
    if (!form.category) return;
    const featureStatuses = { ...unknownFeatures };
    formFeatures.forEach((feature) => { featureStatuses[feature] = 'available'; });
    submitPlace(makePlace({
      id: createId('community-place'),
      name: form.name.trim(),
      category: form.category,
      location: form.address.trim(),
      address: form.address.trim(),
      phone: form.contact.trim(),
      email: form.contact.includes('@') ? form.contact.trim() : 'Not provided',
      website: form.website.trim() || 'Not provided',
      hours: ['Opening hours|Not provided'],
      features: featureStatuses,
      about: form.notes.trim() || 'Community-submitted prototype entry. Accessibility details have not been verified.',
      verification: 'Pending Verification',
      rating: null,
      reviewCount: 0,
      sampleReviews: [],
      reviewedDate: 'Not yet reviewed',
    }));
    setSubmittedMode('suggestion');
  };
  const submitIssue = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedTarget) return;
    submitReport(selectedTarget, reportMessage.trim());
    setSubmittedMode('report');
  };

  if (submittedMode) return (
    <main className="page-wrap app-main"><div className="form-shell"><div className="form-card success-card"><span className="success-icon"><Check size={29} /></span><h2>{submittedMode === 'suggestion' ? 'Thanks for contributing.' : 'Thanks for reporting this.'}</h2><p>{submittedMode === 'suggestion' ? 'Your place is now listed in this browser as Pending Verification.' : 'Your report is saved in this browser for the demo only. Nothing was sent to the institution.'}</p><button className="primary-button" onClick={() => { setSubmittedMode(null); setMode('choose'); }}>Contribute again</button><button className="ghost-button" onClick={onReturnHome} style={{ marginLeft: 8 }}>Return home</button></div></div></main>
  );

  return (
    <main className="page-wrap app-main">
      <Breadcrumb onBack={onBack} />
      <div className="form-shell">
        <div className="eyebrow">Help make access easier to find</div>
        <h1 className="page-title display">Contribute to FindAble</h1>
        {mode === 'choose' ? <>
          <p className="page-intro">Add a sample place or report accessibility information that may need an update. Contributions stay in this browser in the prototype.</p>
          <div className="contribution-options">
            <button className="contribution-option" onClick={() => setMode('add')}><span className="category-icon"><Building2 size={20} /></span><strong>Add a place</strong><span>Tell us about an institution that provides accessible services.</span><span className="option-action">Start a place suggestion <ArrowRight size={15} /></span></button>
            <button className="contribution-option report-option" onClick={() => { setTargetId(''); setMode('report'); }}><span className="category-icon"><AlertTriangle size={20} /></span><strong>Report incorrect information</strong><span>Help us keep accessibility information accurate.</span><span className="option-action">Report an issue <ArrowRight size={15} /></span></button>
          </div>
          <p className="form-hint">All contributions are local demo data and are not sent for review.</p>
        </> : mode === 'add' ? <>
          <p className="page-intro">Tell us about an institution that provides accessible services.</p>
          <form className="form-card" onSubmit={submitSuggestion} style={{ marginTop: 26 }}>
            <fieldset className="form-section"><legend>Institution details</legend><div className="field-grid">
              <div className="field"><label htmlFor="institution-name">Institution name</label><input id="institution-name" required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Institution name" /></div>
              <div className="field"><label htmlFor="institution-category">Category</label><select id="institution-category" required value={form.category} onChange={(event) => update('category', event.target.value as Category | '')}><option value="">Choose a category</option>{serviceCategories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              <div className="field full"><label htmlFor="institution-address">Location</label><input id="institution-address" required value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="Area or address" /></div>
              <div className="field"><label htmlFor="institution-contact">Contact</label><input id="institution-contact" value={form.contact} onChange={(event) => update('contact', event.target.value)} placeholder="Phone or email" /></div>
              <div className="field"><label htmlFor="institution-website">Website</label><input id="institution-website" value={form.website} onChange={(event) => update('website', event.target.value)} placeholder="Optional website" /></div>
            </div></fieldset>
            <fieldset className="form-section"><legend>Accessibility features</legend><p className="form-hint">Select only what you believe the institution currently offers.</p><div className="feature-checks">{accessibilityFeatureList.map((feature) => <label className="check-label feature-check" key={feature}><input type="checkbox" checked={formFeatures.includes(feature)} onChange={() => toggle(feature)} /><span>{feature}</span></label>)}</div></fieldset>
            <fieldset className="form-section"><legend>Additional information</legend><div className="field"><label htmlFor="institution-notes">Notes (optional)</label><textarea id="institution-notes" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Anything else that could help someone plan?" /></div></fieldset>
            <div className="form-foot"><span className="form-hint">Your entry will be marked Pending Verification. It is not sent anywhere.</span><div className="form-actions"><button type="button" className="outline-button" onClick={() => setMode('choose')}>Cancel</button><button type="submit" className="primary-button">Add a place <ArrowRight size={16} /></button></div></div>
          </form>
        </> : <>
          <p className="page-intro">Tell us which accessibility information might be incorrect. This demo report stays in your browser and does not contact the institution.</p>
          <form className="form-card" onSubmit={submitIssue} style={{ marginTop: 26 }}>
            <div className="field"><label htmlFor="report-place">Institution</label><select id="report-place" required value={targetId} onChange={(event) => setTargetId(event.target.value)}><option value="">Choose a place</option>{allPlaces.map((place) => <option key={place.id} value={place.id}>{place.name} · {place.location}</option>)}</select></div>
            {selectedTarget && <div className="report-target-note"><VerificationBadge status={selectedTarget.verification} /><span>{selectedTarget.name} · {selectedTarget.location}</span></div>}
            <div className="field"><label htmlFor="report-notes">What should be checked?</label><textarea id="report-notes" required minLength={5} maxLength={800} value={reportMessage} onChange={(event) => setReportMessage(event.target.value)} placeholder="Describe the information that needs correcting." /></div>
            <div className="form-foot"><span className="form-hint">Prototype report only. No institution will be contacted.</span><div className="form-actions"><button type="button" className="outline-button" onClick={() => setMode('choose')}>Cancel</button><button type="submit" className="primary-button">Submit report <ArrowRight size={16} /></button></div></div>
          </form>
        </>}
      </div>
    </main>
  );
}

function PrototypeDialog({ kind, place, onClose }: { kind: 'directions' | 'contact'; place: Place; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="prototype-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="dialog-close" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        {kind === 'directions' ? <>
          <div className="dialog-icon"><Navigation size={22} /></div>
          <div className="eyebrow">Maps & directions · demo</div>
          <h2 id="dialog-title">Directions to {place.name}</h2>
          <p className="about-copy">This sample address is fictional. Use the map link only to see how directions would open in the finished product.</p>
          <div className="dialog-map"><MapPin size={28} /><span>{place.location}</span></div>
          <div className="dialog-address"><strong>Address</strong><span>{place.address}</span></div>
          <a className="primary-button dialog-primary" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`} target="_blank" rel="noreferrer">Open directions <ArrowRight size={16} /></a>
        </> : <>
          <div className="dialog-icon"><Phone size={22} /></div>
          <div className="eyebrow">Contact options · demo</div>
          <h2 id="dialog-title">Contact {place.name}</h2>
          <p className="about-copy">These sample details are fictional. The links below only demonstrate how contact options could work.</p>
          <div className="dialog-contact-list"><a href={`tel:${place.phone.replaceAll(' ', '')}`}><Phone size={17} /><span><strong>Phone</strong>{place.phone}</span></a><a href={`mailto:${place.email}`}><Mail size={17} /><span><strong>Email</strong>{place.email}</span></a><div><Building2 size={17} /><span><strong>Website</strong>{place.website}</span></div></div>
        </>}
        <button className="text-button dialog-dismiss" onClick={onClose}>Close</button>
      </section>
    </div>
  );
}

function App() {
  const auth = useAuth();
  const [screen, setScreen] = useState<Screen>("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailsReturnTo, setDetailsReturnTo] = useState<Screen>("results");
  const [contributionReturnTo, setContributionReturnTo] = useState<Screen>("home");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [communityPlaces, setCommunityPlaces] = useStoredState<Place[]>("findable:community-places", []);
  const [feedbackByPlace, setFeedbackByPlace] = useStoredState<Record<string, CommunityFeedback[]>>("findable:community-feedback", {});
  const [, setReports] = useStoredState<AccessibilityReport[]>("findable:accessibility-reports", []);
  const [memberReviews, setMemberReviews] = useState<Record<string, UserReview[]>>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [authPrompt, setAuthPrompt] = useState<"save" | "review" | null>(null);
  const [submittedMode, setSubmittedMode] = useState<"suggestion" | "report" | null>(null);
  const [contributionMode, setContributionMode] = useState<ContributionMode>("choose");
  const [reportTarget, setReportTarget] = useState<Place | null>(null);
  const [dialog, setDialog] = useState<{ kind: "directions" | "contact"; place: Place } | null>(null);

  const navigate = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const toggleFeature = (feature: Feature) => setSelectedFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3800); };
  const allPlaces = useMemo(() => [...places, ...communityPlaces], [communityPlaces]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setSavedIds([]);
      setProfile(null);
      return;
    }
    Promise.all([
      fetch("/api/user/saved", { credentials: "include" }).then((response) => response.ok ? response.json() as Promise<{ placeIds: string[] }> : Promise.reject(new Error("Unable to load saved places"))),
      fetch("/api/user/profile", { credentials: "include" }).then((response) => response.ok ? response.json() as Promise<Profile> : Promise.reject(new Error("Unable to load profile"))),
    ]).then(([saved, account]) => {
      setSavedIds(saved.placeIds);
      setProfile(account);
    }).catch(() => showToast("We could not load your account data. Please try again."));
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (!selectedPlace) return;
    fetch(`/api/places/${encodeURIComponent(selectedPlace.id)}/reviews`, { credentials: "include" })
      .then((response) => response.ok ? response.json() as Promise<{ reviews: UserReview[] }> : Promise.reject(new Error("Unable to load reviews")))
      .then((data) => setMemberReviews((current) => ({ ...current, [selectedPlace.id]: data.reviews })))
      .catch(() => showToast("Member reviews are temporarily unavailable."));
  }, [selectedPlace?.id]);

  const openPlace = (place: Place, returnTo: Screen = screen) => { setSelectedPlace(place); setDetailsReturnTo(returnTo); navigate("details"); };
  const toggleSaved = async (place: Place) => {
    if (!auth.isAuthenticated) {
      setAuthPrompt("save");
      return;
    }
    const isSaved = savedIds.includes(place.id);
    const response = await fetch("/api/user/saved", {
      method: isSaved ? "DELETE" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId: place.id }),
    });
    if (!response.ok) {
      showToast("We could not update your saved places.");
      return;
    }
    setSavedIds((current) => isSaved ? current.filter((id) => id !== place.id) : [...current, place.id]);
    showToast(isSaved ? `${place.name} removed from saved places.` : `${place.name} saved to your account.`);
  };
  const toggleComparison = (place: Place) => {
    if (comparisonIds.includes(place.id)) {
      setComparisonIds((current) => current.filter((item) => item !== place.id));
      return;
    }
    if (comparisonIds.length >= 2) {
      showToast("Compare up to two places at a time.");
      return;
    }
    setComparisonIds((current) => [...current, place.id]);
  };
  const openContribution = () => {
    setContributionMode("choose");
    setReportTarget(null);
    setSubmittedMode(null);
    setContributionReturnTo("home");
    navigate("contribute");
  };
  const openReport = (place: Place | null = null) => {
    setReportTarget(place);
    setContributionMode("report");
    setSubmittedMode(null);
    setContributionReturnTo(place ? "details" : "home");
    navigate("contribute");
  };
  const submitPlace = (place: Place) => {
    setCommunityPlaces((current) => [place, ...current]);
    showToast("Your place is saved locally as Pending Verification.");
  };
  const submitReport = (place: Place, message: string) => {
    setReports((current) => [...current, { id: createId("report"), placeId: place.id, placeName: place.name, message, createdAt: new Date().toISOString() }]);
    showToast("Your report is saved in this browser for the demo.");
  };
  const submitReview = async (placeId: string, feedback: CommunityFeedback) => {
    const response = await fetch(`/api/places/${encodeURIComponent(placeId)}/reviews`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
      showToast("We could not submit your review. Please try again.");
      return;
    }
    const review = await response.json() as UserReview;
    setMemberReviews((current) => ({ ...current, [placeId]: [...(current[placeId] ?? []), review] }));
    showToast("Your review was added to this place.");
    navigate("details");
  };
  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allPlaces.filter((place) => {
      const searchable = `${place.name} ${place.category} ${place.location} ${place.address}`.toLowerCase();
      return (!normalized || searchable.includes(normalized)) && (!category || category === place.category) && selectedFeatures.every((feature) => place.features[feature] === "available");
    });
  }, [allPlaces, query, category, selectedFeatures]);

  const openFeedback = () => {
    if (!auth.isAuthenticated) {
      setAuthPrompt("review");
      return;
    }
    navigate("feedback");
  };
  const navigateFromMenu = (next: Screen) => {
    if (next === "contribute") openContribution();
    else if (next === "profile" && !auth.isAuthenticated) setAuthPrompt("review");
    else navigate(next);
  };
  let content: ReactNode = null;
  if (screen === "home") content = <Home query={query} setQuery={setQuery} onSearch={() => navigate("results")} onCategory={(value) => { setCategory(value); navigate("results"); }} onLocation={() => showToast("This prototype uses sample Nairobi locations and does not access your device location.")} navigate={navigateFromMenu} />;
  if (screen === "search") content = <SearchPage query={query} setQuery={setQuery} category={category} setCategory={setCategory} selectedFeatures={selectedFeatures} toggleFeature={toggleFeature} onSubmit={() => navigate("results")} onBack={() => navigate("home")} />;
  if (screen === "results") content = <Results query={query} setQuery={setQuery} category={category} setCategory={setCategory} selectedFeatures={selectedFeatures} toggleFeature={toggleFeature} filteredPlaces={filteredPlaces} openPlace={(place) => openPlace(place, "results")} savedIds={savedIds} toggleSaved={(place) => { void toggleSaved(place); }} comparisonIds={comparisonIds} toggleComparison={toggleComparison} comparisonOpen={comparisonOpen} setComparisonOpen={setComparisonOpen} onBack={() => navigate("search")} />;
  if (screen === "details" && selectedPlace) content = <Details place={selectedPlace} feedback={feedbackByPlace[selectedPlace.id] ?? []} reviews={memberReviews[selectedPlace.id] ?? []} isSaved={savedIds.includes(selectedPlace.id)} onToggleSaved={() => { void toggleSaved(selectedPlace); }} onBack={() => navigate(detailsReturnTo)} onDirections={() => setDialog({ kind: "directions", place: selectedPlace })} onContact={() => setDialog({ kind: "contact", place: selectedPlace })} onReport={() => openReport(selectedPlace)} onFeedback={openFeedback} />;
  if (screen === "saved") content = <SavedPlaces savedPlaces={allPlaces.filter((place) => savedIds.includes(place.id))} savedIds={savedIds} toggleSaved={(place) => { void toggleSaved(place); }} openPlace={(place) => openPlace(place, "saved")} onDiscover={() => navigate("search")} isAuthenticated={auth.isAuthenticated} onLogin={auth.login} />;
  if (screen === "feedback" && selectedPlace) content = <FeedbackPage place={selectedPlace} onCancel={() => navigate("details")} onSubmit={(feedback) => submitReview(selectedPlace.id, feedback)} />;
  if (screen === "contribute") content = <Contribution mode={contributionMode} setMode={setContributionMode} reportTarget={reportTarget} allPlaces={allPlaces} onBack={() => navigate(contributionReturnTo)} onReturnHome={() => navigate("home")} submittedMode={submittedMode} setSubmittedMode={setSubmittedMode} submitPlace={submitPlace} submitReport={submitReport} />;
  if (screen === "profile") content = <ProfilePage profile={profile} savedCount={savedIds.length} onSaved={() => navigate("saved")} onLogout={auth.logout} />;

  return <div className="app-shell"><Header navigate={navigateFromMenu} auth={auth} />{content}{dialog && <PrototypeDialog kind={dialog.kind} place={dialog.place} onClose={() => setDialog(null)} />}{authPrompt && <AuthPrompt kind={authPrompt} onClose={() => setAuthPrompt(null)} onLogin={auth.login} />}{toast && <div className="toast" role="status"><Check size={17} /><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={16} /></button></div>}</div>;
}

export default App;