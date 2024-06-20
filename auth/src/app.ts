import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@tazaker/common";

import { currentUserRouter } from "./routes/current-user";
import { startRouter } from "./routes/start";
import { signOutRouter } from "./routes/sign-out";
import { completeRouter } from "./routes/complete";
import { updateAuthRouter } from "./routes/update";

export const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: ["production"].includes(process.env.ENVIRONMENT!),
  })
);

app.use(currentUserRouter);
app.use(startRouter);
app.use(signOutRouter);
app.use(completeRouter);
app.use(updateAuthRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
