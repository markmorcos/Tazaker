import express, { Request, Response } from "express";
import { mongo, connection } from "mongoose";
import { param } from "express-validator";

import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from "@tazaker/common";

import { Ticket } from "../models/ticket";

const downloadFile = (fileId: string): Promise<mongo.GridFSBucketReadStream> =>
  new Promise((resolve, reject) => {
    try {
      const bucket = new mongo.GridFSBucket(connection.db);
      const downloadStream = bucket.openDownloadStream(
        new mongo.ObjectId(fileId)
      );
      downloadStream.on("error", reject);

      resolve(downloadStream);
    } catch (error) {
      throw new Error("Error opening download stream");
    }
  });

const router = express.Router();

router.get(
  "/api/tickets/:id",
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

router.get(
  "/api/tickets/:id/file",
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderUserId !== req.currentUser?.id) {
      return res.send("Not authorized");
    }

    const { fileId } = ticket;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileId}.pdf"`
    );

    try {
      const downloadStream = await downloadFile(fileId);
      downloadStream.on("finish", () => res.end());
      downloadStream.pipe(res);
    } catch (error) {
      throw new BadRequestError("Could not download ticket");
    }
  }
);

export { router as readTicketRouter };
