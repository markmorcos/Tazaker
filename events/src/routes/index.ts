import express, { Request, Response } from "express";

import { Event } from "../models/event";

const router = express.Router();

router.get("/api/events", async (req: Request, res: Response) => {
  const events = await Event.find({ end: { $gte: new Date() } }).sort({
    start: "ascending",
  });

  res.status(200).send(events);
});

export { router as indexEventRouter };
