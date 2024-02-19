import express, { Request, Response } from "express";

import { requireAuth } from "@tazaker/common";

import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const { id: userId } = req.currentUser!;

  const orders = await Order.find({ userId })
    .sort({ expiresAt: "descending" })
    .populate({ path: "ticket", populate: "event" });

  res.send(orders);
});

export { router as indexOrderRouter };
