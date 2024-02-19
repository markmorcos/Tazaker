import express, { Request, Response } from "express";

import { Event } from "../models/event";

const router = express.Router();

router.get("/api/events", async (req: Request, res: Response) => {
  const events = await Event.find().sort({ start: "ascending" });

  res.send(events);
});

export { router as indexEventRouter };
