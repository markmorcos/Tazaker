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
    body("start").notEmpty().withMessage("Start is required"),
    body("end").notEmpty().withMessage("End is required"),
    body("timezone").notEmpty().withMessage("Timezone is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      throw new NotFoundError();
    }

    const { title, url, image, start, end, timezone } = req.body;
    event.set({
      title,
      url,
      image,
      start: new Date(start),
      end: new Date(end),
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

    res.status(200).send(event);
  }
);

export { router as updateEventRouter };
