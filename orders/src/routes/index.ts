import express, { Request, Response } from "express";
import { Types } from "mongoose";

import { defaultFees, OrderStatus, requireAuth } from "@tazaker/common";

import { Order, OrderDoc } from "../models/order";

const router = express.Router();

const aggregateOrderMapper = (order: OrderDoc) => {
  order.id = order._id;
  delete order._id;

  order.ticket.id = order.ticket._id;
  delete order.ticket._id;
  order.ticket.fees = defaultFees(order.ticket.price);
  order.ticket.total = order.ticket.price + order.ticket.fees;

  order.ticket.event.id = order.ticket.event._id;
  delete order.ticket.event._id;

  return order;
};

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const { id: userId } = req.currentUser!;

  const orders = await Order.find({ userId })
    .sort({ expiresAt: "descending" })
    .populate({ path: "ticket", populate: "event" });

  res.status(200).send(orders);
});

router.get(
  "/api/orders/sales",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id: userId } = req.currentUser!;

    const aggregateOrders = await Order.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "ticket",
          foreignField: "_id",
          as: "ticket",
        },
      },
      { $unwind: "$ticket" },
      {
        $lookup: {
          from: "events",
          localField: "ticket.event",
          foreignField: "_id",
          as: "ticket.event",
        },
      },
      { $unwind: "$ticket.event" },
      {
        $match: {
          status: OrderStatus.Complete,
          "ticket.user": new Types.ObjectId(userId),
        },
      },
      { $sort: { expiresAt: -1 } },
    ]);

    const orders = aggregateOrders.map(aggregateOrderMapper);

    res.status(200).send(orders);
  }
);

export { router as indexOrderRouter };
