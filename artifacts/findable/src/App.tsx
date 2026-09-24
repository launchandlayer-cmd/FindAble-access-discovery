import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Compass,
  GraduationCap,
  HeartPulse,
  Info,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Store,
  X,
} from 'lucide-react';

type Screen = 'home' | 'search' | 'results' | 'details' | 'contribute';
type Category = 'Healthcare' | 'Schools' | 'Government Services' | 'Businesses' | 'Other Services';
type Feature = 'KSL Support' | 'Deaf-Friendly Staff' | 'Interpreter Available' | 'Accessible Information';

type Place = {
  id: string;
  name: string;
  category: Category;
  location: string;
  address: string;
  phone: string;
  email: string;
  hours: string[];
  features: Feature[];
  about: string;
};

const features: Feature[] = [
  'KSL Support',
  'Deaf-Friendly Staff',
  'Interpreter Available',
  'Accessible Information',
];

const serviceCategories: Category[] = [
  'Healthcare',
  'Schools',
  'Government Services',
  'Businesses',
  'Other Services',
];

const places: Place[] = [
  {
    id: 'hopecare',
    name: 'HopeCare Medical Centre',
    category: 'Healthcare',
    location: 'Kilimani, Nairobi',
    address: '14 Kindaruma Road, Kilimani, Nairobi',
    phone: '+254 700 240 118',
    email: 'hello@hopecare.example',
    hours: ['Monday – Friday|8:00 AM – 6:00 PM', 'Saturday|9:00 AM – 1:00 PM', 'Sunday|Closed'],
    features: ['KSL Support', 'Deaf-Friendly Staff', 'Accessible Information'],
    about: 'A fictional community clinic offering general care and patient support. The centre says visitors can request KSL support at reception and receive written information for appointments.',
  },
  {
    id: 'brightpath',
    name: 'BrightPath Academy',
    category: 'Schools',
    location: 'Westlands, Nairobi',
    address: '7 Muthangari Drive, Westlands, Nairobi',
    phone: '+254 711 893 402',
    email: 'office@brightpath.example',
    hours: ['Monday – Friday|7:30 AM – 4:30 PM', 'Saturday|By appointment', 'Sunday|Closed'],
    features: ['KSL Support', 'Interpreter Available', 'Accessible Information'],
    about: 'A fictional primary and secondary school. BrightPath says families can request an interpreter for meetings and access school updates in written formats.',
  },
  {
    id: 'community-access',
    name: 'Community Access Centre',
    category: 'Government Services',
    location: 'City Centre, Nairobi',
    address: '2 Harambee Avenue, City Centre, Nairobi',
    phone: '+254 720 456 733',
    email: 'welcome@communityaccess.example',
    hours: ['Monday – Friday|8:30 AM – 4:00 PM', 'Saturday|Closed', 'Sunday|Closed'],
    features: ['KSL Support', 'Deaf-Friendly Staff', 'Interpreter Available', 'Accessible Information'],
    about: 'A fictional public-service information centre. The centre says staff can help visitors request KSL support, interpretation, and clear printed information.',
  },
];

const categoryDetails: { label: Category; icon: ReactNode; description: string }[] = [
  { label: 'Healthcare', icon: <HeartPulse size={19} strokeWidth={2.1} />, description: 'Clinics and care' },
  { label: 'Schools', icon: <GraduationCap size={19} strokeWidth={2.1} />, description: 'Learning and support' },
  { label: 'Government Services', icon: <Landmark size={19} strokeWidth={2.1} />, description: 'Public information' },
  { label: 'Businesses', icon: <Store size={19} strokeWidth={2.1} />, description: 'Everyday places' },
];

function Header({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('home')} aria-label="Go to FindAble home">
        <span className="brand-mark" aria-hidden="true"><Accessibility size={21} /></span>
        <span className="brand-name">FindAble</span>
      </button>
      <nav className="header-links" aria-label="Main navigation">
        <button className="header-link" onClick={() => navigate('search')}>Find a service</button>
        <button className="header-link" onClick={() => navigate('contribute')}>Add or report a place</button>
        <button className="pill-button" onClick={() => navigate('search')}><Compass size={16} /> Nairobi</button>
        <button className="mobile-menu" aria-label="Open navigation" onClick={() => navigate('search')}><Menu size={23} /></button>
      </nav>
    </header>
  );
}

function Footer() {
  return <footer className="footer">FindAble is a practical prototype for discovering communication access. Sample places and details are fictional and have not been verified.</footer>;
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
            <h1 id="home-title" className="display">Find places where communication is accessible.</h1>
            <p className="hero-copy">A clear, practical guide to institutions that say they offer communication support for Deaf visitors.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigate('search')}>Find a service <ArrowRight size={17} /></button>
              <button className="outline-button" onClick={() => navigate('contribute')}>Add or report a place</button>
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
            <div><div className="eyebrow">Browse by need</div><h2 id="categories-title" className="display">Start with a category</h2></div>
            <button className="ghost-button" onClick={() => navigate('search')}>View all services <ChevronRight size={16} /></button>
          </div>
          <div className="category-grid">
            {categoryDetails.map((category) => (
              <button className="category-card" key={category.label} onClick={() => onCategory(category.label)}>
                <span className="category-icon">{category.icon}</span>
                <span><h3>{category.label}</h3><span style={{ color: '#718079', fontSize: 12 }}>{category.description}</span></span>
              </button>
            ))}
          </div>
        </section>

        <div className="home-note">
          <Info className="note-icon" size={25} />
          <div><strong>A calmer way to prepare</strong><p>FindAble helps you discover places that say they offer accessible communication and services for Deaf people. Use this information as a starting point for planning, not a guarantee.</p></div>
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
      <h1 className="page-title display">Find a service</h1>
      <p className="page-intro">Tell us what you need and we will show places in Nairobi that match the communication support you are looking for.</p>
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
          <legend>Communication support</legend>
          <p className="filter-title" style={{ fontWeight: 400, color: '#718079', fontSize: 13, marginTop: -5 }}>Show places that list any of these features.</p>
          <div className="filter-list">
            {features.map((feature) => <label className="check-label" key={feature}><input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => toggleFeature(feature)} /> <span>{feature}</span></label>)}
          </div>
        </fieldset>
      </div>
    </main>
  );
}

function ResultCard({ place, open }: { place: Place; open: () => void }) {
  return (
    <button className="result-card" onClick={open} aria-label={`View details for ${place.name}`}>
      <span style={{ textAlign: 'left' }}>
        <span className="eyebrow">{place.category}</span>
        <h3>{place.name}</h3>
        <span className="result-meta"><span><MapPin size={14} />{place.location}</span><span><Clock3 size={14} />{place.hours[0].split('|')[1]}</span></span>
        <span className="feature-row">{place.features.map((feature) => <span className="feature-tag" key={feature}><Check size={12} />{feature}</span>)}</span>
      </span>
      <span className="result-arrow"><ArrowRight size={20} /></span>
    </button>
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
  onBack: () => void;
}) {
  return (
    <main className="page-wrap app-main">
      <Breadcrumb onBack={onBack} label="Back to search" />
      <div className="eyebrow" style={{ marginTop: 25 }}>Accessible places in Nairobi</div>
      <h1 className="page-title display">Places that may work for you.</h1>
      <p className="page-intro">Review what each institution says it offers, then contact them before your visit if you need to confirm support.</p>
      <div className="filter-panel" style={{ marginTop: 27 }}>
        <div className="search-input-wrap"><Search size={18} aria-hidden="true" /><input className="search-input search-large" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search results" aria-label="Search results" /></div>
        <div className="filter-box" style={{ padding: '15px 18px' }}>
          <div className="filter-list">
            {features.map((feature) => <label className="check-label" key={feature}><input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={() => toggleFeature(feature)} /> <span>{feature}</span></label>)}
          </div>
          <select aria-label="Filter by category" className="category-select" style={{ margin: '14px 0 0', height: 40 }} value={category} onChange={(event) => setCategory(event.target.value as Category | '')}>
            <option value="">All categories</option><option value="Healthcare">Healthcare</option><option value="Schools">Schools</option><option value="Government Services">Government Services</option><option value="Businesses">Businesses</option><option value="Other Services">Other Services</option>
          </select>
        </div>
      </div>
      <div className="results-toolbar"><div><h2>{filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found</h2><span className="sample-label">Prototype results · not verified</span></div><span className="location"><MapPin size={14} /> Nairobi, Kenya</span></div>
      <div className="result-list">
        {filteredPlaces.length ? filteredPlaces.map((place) => <ResultCard place={place} open={() => openPlace(place)} key={place.id} />) : <div className="empty-state"><Search size={29} /><h2>No places match those filters</h2><p>Try another category or remove one of the communication support filters.</p></div>}
      </div>
    </main>
  );
}

function Details({ place, onBack, showToast, onReport }: { place: Place; onBack: () => void; showToast: (message: string) => void; onReport: () => void }) {
  const [directionsActive, setDirectionsActive] = useState(false);
  return (
    <main className="page-wrap app-main">
      <Breadcrumb onBack={onBack} label="Back to results" />
      <div className="detail-layout">
        <article className="detail-main">
          <div className="detail-kicker"><ShieldCheck size={15} /> Sample institution</div>
          <h1 className="display">{place.name}</h1>
          <div className="detail-location"><MapPin size={16} /> {place.address}</div>
          <div className="verified-note"><CircleAlert size={17} /><span>This is prototype information that has not been verified. Communication support can change, so contact the institution before visiting.</span></div>
          <div className="detail-section">
            <h2>Communication support listed</h2>
            <ul className="accessibility-list">{place.features.map((feature) => <li key={feature}><Check size={17} /> <span>{feature}</span></li>)}</ul>
          </div>
          <div className="detail-section"><h2>About this place</h2><p className="about-copy">{place.about}</p></div>
          <div className="detail-section"><h2>Contact</h2><div className="contact-list"><span className="contact-item"><Phone size={16} /> {place.phone}</span><span className="contact-item"><Mail size={16} /> {place.email}</span></div></div>
          <div className="detail-section"><h2>Opening hours</h2>{place.hours.map((hour) => { const [day, time] = hour.split('|'); return <div className="hours-row" key={day}><span>{day}</span><strong>{time}</strong></div>; })}</div>
        </article>
        <aside className="detail-side">
          <h2>Planning your visit</h2>
          <p className="about-copy" style={{ fontSize: 13 }}>A quick next step can help you arrive prepared.</p>
          <div className="side-actions">
            <button className="primary-button" onClick={() => { setDirectionsActive(true); showToast('Directions are ready to open in this prototype.'); }}><Navigation size={16} /> {directionsActive ? 'Directions selected' : 'Get directions'}</button>
            <button className="outline-button" onClick={() => showToast(`Contact details for ${place.name} are shown above.`)}><Phone size={16} /> Contact institution</button>
            <button className="report-link" onClick={onReport}><CircleAlert size={14} /> Report incorrect information</button>
          </div>
          <div style={{ borderTop: '1px solid #e0e2da', marginTop: 23, paddingTop: 18, color: '#718079', fontSize: 12, lineHeight: 1.5 }}><Info size={15} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Listed features are what this fictional institution says it offers.</div>
        </aside>
      </div>
    </main>
  );
}

function Contribution({ onBack, submittedMode, setSubmittedMode, showToast }: { onBack: () => void; submittedMode: 'suggestion' | 'report' | null; setSubmittedMode: (value: 'suggestion' | 'report' | null) => void; showToast: (message: string) => void }) {
  const [form, setForm] = useState({ name: '', contact: '', address: '', category: '', notes: '' });
  const [formFeatures, setFormFeatures] = useState<Feature[]>([]);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const toggle = (feature: Feature) => setFormFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  const submit = (event: FormEvent, mode: 'suggestion' | 'report') => {
    event.preventDefault();
    setSubmittedMode(mode);
    showToast(mode === 'suggestion' ? 'Your place suggestion is saved in this prototype.' : 'Your report is saved in this prototype.');
  };
  if (submittedMode) return (
    <main className="page-wrap app-main"><div className="form-shell"><div className="form-card success-card"><span className="success-icon"><Check size={29} /></span><h2>{submittedMode === 'suggestion' ? 'Thanks for helping others plan.' : 'Thanks for flagging that.'}</h2><p>This prototype has recorded your {submittedMode === 'suggestion' ? 'place suggestion' : 'report'} locally for this session. Nothing was sent and no institution has been contacted.</p><button className="primary-button" onClick={() => setSubmittedMode(null)}>Add another place</button><button className="ghost-button" onClick={onBack} style={{ marginLeft: 8 }}>Return home</button></div></div></main>
  );
  return (
    <main className="page-wrap app-main">
      <Breadcrumb onBack={onBack} />
      <div className="form-shell">
        <div className="eyebrow">Make the guide more useful</div>
        <h1 className="page-title display">Add or report a place</h1>
        <p className="page-intro">Share what you know about a place and its communication support. We will keep this as a prototype entry for now.</p>
        <form className="form-card" onSubmit={(event) => submit(event, 'suggestion')} style={{ marginTop: 29 }}>
          <fieldset className="form-section"><legend>Institution details</legend><div className="field-grid">
            <div className="field"><label htmlFor="institution-name">Institution name</label><input id="institution-name" required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="For example, a clinic or school" /></div>
            <div className="field"><label htmlFor="institution-contact">Phone or email</label><input id="institution-contact" required value={form.contact} onChange={(event) => update('contact', event.target.value)} placeholder="How can someone reach them?" /></div>
            <div className="field full"><label htmlFor="institution-address">Location or address</label><input id="institution-address" required value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="Area, street or landmark in Nairobi" /></div>
            <div className="field full"><label htmlFor="institution-category">Category</label><select id="institution-category" required value={form.category} onChange={(event) => update('category', event.target.value)}><option value="">Choose a category</option><option>Healthcare</option><option>Schools</option><option>Government Services</option><option>Businesses</option><option>Other Services</option></select></div>
          </div></fieldset>
          <fieldset className="form-section"><legend>Communication support</legend><p className="form-hint" style={{ margin: '-8px 0 14px' }}>Select the features this place says it offers.</p><div className="feature-checks">{features.map((feature) => <label className="check-label feature-check" key={feature}><input type="checkbox" checked={formFeatures.includes(feature)} onChange={() => toggle(feature)} /><span>{feature}</span></label>)}</div></fieldset>
          <fieldset className="form-section"><legend>Anything else to know?</legend><div className="field"><label htmlFor="institution-notes">Notes (optional)</label><textarea id="institution-notes" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="For example, when to request an interpreter or where to check in." /></div></fieldset>
          <div className="form-foot"><span className="form-hint">Prototype only: this form does not send information anywhere.</span><div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}><button type="button" className="outline-button" onClick={(event) => submit(event, 'report')}><CircleAlert size={15} /> Report an issue</button><button type="submit" className="primary-button">Save place suggestion <ArrowRight size={16} /></button></div></div>
        </form>
      </div>
    </main>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [submittedMode, setSubmittedMode] = useState<'suggestion' | 'report' | null>(null);

  const navigate = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const toggleFeature = (feature: Feature) => setSelectedFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  const openPlace = (place: Place) => { setSelectedPlace(place); navigate('details'); };
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3800); };
  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return places.filter((place) => {
      const searchable = `${place.name} ${place.category} ${place.location} ${place.address}`.toLowerCase();
      const matchesText = !normalized || searchable.includes(normalized);
      const matchesCategory = !category || category === place.category;
      const matchesFeatures = selectedFeatures.every((feature) => place.features.includes(feature));
      return matchesText && matchesCategory && matchesFeatures;
    });
  }, [query, category, selectedFeatures]);

  let content: ReactNode;
  if (screen === 'home') content = <Home query={query} setQuery={setQuery} onSearch={() => navigate('results')} onCategory={(value) => { setCategory(value); navigate('results'); }} onLocation={() => showToast('This prototype uses sample Nairobi locations and does not access your device location.')} navigate={navigate} />;
  if (screen === 'search') content = <SearchPage query={query} setQuery={setQuery} category={category} setCategory={setCategory} selectedFeatures={selectedFeatures} toggleFeature={toggleFeature} onSubmit={() => navigate('results')} onBack={() => navigate('home')} />;
  if (screen === 'results') content = <Results query={query} setQuery={setQuery} category={category} setCategory={setCategory} selectedFeatures={selectedFeatures} toggleFeature={toggleFeature} filteredPlaces={filteredPlaces} openPlace={openPlace} onBack={() => navigate('search')} />;
  if (screen === 'details' && selectedPlace) content = <Details place={selectedPlace} onBack={() => navigate('results')} showToast={showToast} onReport={() => { setSubmittedMode(null); navigate('contribute'); }} />;
  if (screen === 'contribute') content = <Contribution onBack={() => navigate('home')} submittedMode={submittedMode} setSubmittedMode={setSubmittedMode} showToast={showToast} />;

  return <div className="app-shell"><Header navigate={navigate} />{content}{toast && <div className="toast" role="status"><Check size={17} /><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={16} /></button></div>}</div>;
}

export default App;