import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@tazaker/common";

import { createPayoutRouter } from "./routes/create";
import { readPayoutRouter } from "./routes/read";

export const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: ["production"].includes(process.env.ENVIRONMENT!),
  })
);
app.use(currentUser);

app.use(createPayoutRouter);
app.use(readPayoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
