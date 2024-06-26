import express, { Request, Response } from "express";

import { currentUser, requireAuth } from "@tazaker/common";

const router = express.Router();

router.get(
  "/api/users/current",
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.status(200).send({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
