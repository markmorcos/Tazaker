import express, { Request, Response } from "express";

import { requireAuth } from "@tazaker/common";

import { Wallet } from "../models/wallet";

const router = express.Router();

router.get("/api/payouts", requireAuth, async (req: Request, res: Response) => {
  const balance = await Wallet.balance(req.currentUser!.id);

  res.status(200).send({ balance });
});

export { router as readPayoutRouter };
