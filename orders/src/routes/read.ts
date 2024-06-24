import express, { Request, Response } from "express";
import { param } from "express-validator";

import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tazaker/common";

import { Order } from "../models/order";
import { stripe } from "../stripe";

const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id)
      .populate("ticket")
      .populate({ path: "ticket", populate: { path: "user" } })
      .populate({ path: "ticket", populate: { path: "event" } });

    if (!order) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== order.userId) {
      throw new NotAuthorizedError();
    }

    const session = await stripe.checkout.sessions.retrieve(order.sessionId!);
    if (session.status === "expired") {
      order.set("status", OrderStatus.Expired);
      await order.save();
      return res.send(order);
    }

    res.send({ ...order.toJSON(), clientSecret: session.client_secret });
  }
);

export { router as readOrderRouter };
