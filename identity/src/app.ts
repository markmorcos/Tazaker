import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@tazaker/common";

import { completeRouter } from "./routes/auth/complete";
import { signOutRouter } from "./routes/auth/sign-out";
import { startRouter } from "./routes/auth/start";

import { currentUserRouter } from "./routes/users/current";

export const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(cookieSession({ signed: false, secure: true }));

app.use(completeRouter);
app.use(signOutRouter);
app.use(startRouter);

app.use(currentUserRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
