import express, { Request, Response } from "express";
import { body, param } from "express-validator";

import { NotFoundError, requireAuth, validateRequest } from "@tazaker/common";

import { Event } from "../models/event";
import { nats } from "../nats";
import { EventUpdatedPublisher } from "../events/publishers/event-updated-publisher";

const router = express.Router();

router.put(
  "/api/events/:id",
  requireAuth,
  [
    param("id").isMongoId(),
    body("title").notEmpty().withMessage("Title is required"),
    body("url").notEmpty().withMessage("URL is required"),
    body("image").notEmpty().withMessage("Image is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("startTime").notEmpty().withMessage("Start time is required"),
    body("endDate").notEmpty().withMessage("End date is required"),
    body("endTime").notEmpty().withMessage("End time is required"),
    body("timezone").notEmpty().withMessage("Timezone is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      throw new NotFoundError();
    }

    const {
      title,
      url,
      image,
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
    } = req.body;
    event.set({
      title,
      url,
      image,
      start: new Date(`${startDate}T${startTime}Z`),
      end: new Date(`${endDate}T${endTime}Z`),
      timezone,
    });
    await event.save();

    await new EventUpdatedPublisher(nats.client).publish({
      id: event.id,
      title: event.title,
      url: event.url,
      image: event.image,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      timezone: event.timezone,
      version: event.version,
    });

    res.send(event);
  }
);

export { router as updateEventRouter };
