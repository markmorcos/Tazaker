import express from "express";

const router = express.Router();

router.post("/api/auth/sign-out", (req, res) => {
  delete req.session?.jwt;

  res.sendStatus(204);
});

export { router as signOutRouter };
