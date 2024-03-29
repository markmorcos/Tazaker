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
import { nats } from "../nats";
import { OrderExpiredPublisher } from "../events/publishers/order-expired-publisher";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== order.userId) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Expired;
    await order.save();

    await new OrderExpiredPublisher(nats.client).publish({
      id: order.id,
      ticket: { id: order.ticket.id },
      version: order.version,
    });

    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
