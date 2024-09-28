import express, { Request, Response } from "express";
import { param } from "express-validator";

import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  baseURL,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;

    const order = await Order.findById(req.params.id)
      .populate("ticket")
      .populate({ path: "ticket", populate: { path: "user" } })
      .populate({ path: "ticket", populate: { path: "event" } });

    if (!order) {
      throw new NotFoundError();
    }

    if (userId !== order.userId) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export { router as readOrderRouter };
