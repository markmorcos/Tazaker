import express, { Request, Response } from "express";
import { query } from "express-validator";
import { sign } from "jsonwebtoken";

import { NotAuthorizedError, validateRequest } from "@tazaker/common";

import { User } from "../../models/user";

const router = express.Router();

router.get(
  "/api/auth/complete",
  [query("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, code } = req.query;

    const user = await User.findOne({
      email: decodeURIComponent(String(email)),
    });
    if (!user || user.code !== code) {
      throw new NotAuthorizedError();
    }

    user.set("code", undefined);
    await user.save();

    req.session!.jwt = sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    res.redirect("/");
  }
);

export { router as completeRouter };
