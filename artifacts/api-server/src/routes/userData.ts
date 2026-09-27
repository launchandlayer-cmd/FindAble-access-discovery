import {
  CreatePlaceReviewBody,
  CreatePlaceReviewResponse,
  ListPlaceReviewsResponse,
  ListSavedPlacesResponse,
  SavePlaceBody,
  UnsavePlaceBody,
} from "@workspace/api-zod";
import { db, reviewsTable, savedPlacesTable, usersTable } from "@workspace/db";
import { and, asc, eq } from "drizzle-orm";
import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

function requireUser(req: Request, res: Response): string | null {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return req.user.id;
}

function displayName(user: { firstName: string | null; lastName: string | null; email: string | null }) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email || "FindAble member";
}

router.get("/user/saved", async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const rows = await db.select({ placeId: savedPlacesTable.placeId }).from(savedPlacesTable).where(eq(savedPlacesTable.userId, userId));
  res.json(ListSavedPlacesResponse.parse({ placeIds: rows.map((row) => row.placeId) }));
});

router.post("/user/saved", async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const parsed = SavePlaceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A place ID is required" });
    return;
  }
  await db.insert(savedPlacesTable).values({ userId, placeId: parsed.data.placeId }).onConflictDoNothing();
  res.status(204).send();
});

router.delete("/user/saved", async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const parsed = UnsavePlaceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A place ID is required" });
    return;
  }
  await db.delete(savedPlacesTable).where(and(eq(savedPlacesTable.userId, userId), eq(savedPlacesTable.placeId, parsed.data.placeId)));
  res.status(204).send();
});

router.get("/places/:placeId/reviews", async (req, res) => {
  const rows = await db
    .select({
      id: reviewsTable.id,
      userName: usersTable.firstName,
      userLastName: usersTable.lastName,
      userEmail: usersTable.email,
      overall: reviewsTable.overall,
      communication: reviewsTable.communication,
      staffUnderstanding: reviewsTable.staffUnderstanding,
      text: reviewsTable.text,
      createdAt: reviewsTable.createdAt,
    })
    .from(reviewsTable)
    .innerJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
    .where(eq(reviewsTable.placeId, req.params.placeId))
    .orderBy(asc(reviewsTable.createdAt));
  res.json(ListPlaceReviewsResponse.parse({
    reviews: rows.map((row) => ({
      id: String(row.id),
      userName: displayName({ firstName: row.userName, lastName: row.userLastName, email: row.userEmail }),
      overall: row.overall,
      communication: row.communication,
      staffUnderstanding: row.staffUnderstanding,
      text: row.text,
      createdAt: row.createdAt,
    })),
  }));
});

router.post("/places/:placeId/reviews", async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const parsed = CreatePlaceReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please complete the review before submitting" });
    return;
  }
  const [review] = await db.insert(reviewsTable).values({
    userId,
    placeId: req.params.placeId,
    overall: parsed.data.overall,
    communication: parsed.data.communication,
    staffUnderstanding: parsed.data.staffUnderstanding,
    text: parsed.data.text.trim(),
  }).returning();
  const [user] = await db.select({
    firstName: usersTable.firstName,
    lastName: usersTable.lastName,
    email: usersTable.email,
  }).from(usersTable).where(eq(usersTable.id, userId));
  res.status(201).json(CreatePlaceReviewResponse.parse({
    id: String(review.id),
    userName: displayName(user),
    overall: review.overall,
    communication: review.communication,
    staffUnderstanding: review.staffUnderstanding,
    text: review.text,
    createdAt: review.createdAt,
  }));
});

router.get("/user/profile", async (req, res) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const [user] = await db.select({
    id: usersTable.id,
    email: usersTable.email,
    firstName: usersTable.firstName,
    lastName: usersTable.lastName,
    createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json({
    id: user.id,
    name: displayName(user),
    email: user.email,
    createdAt: user.createdAt,
  });
});

export default router;