import express, { Request, Response } from "express";

import { requireAuth, validateRequest } from "@tazaker/common";

const router = express.Router();

router.post(
  "/api/payouts",
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(201).send({});
  }
);

export { router as createPayoutRouter };
