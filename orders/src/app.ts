import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@tazaker/common";

import { indexOrderRouter } from "./routes";
import { createOrderRouter } from "./routes/create";
import { readOrderRouter } from "./routes/read";

export const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(cookieSession({ signed: false, secure: true }));
app.use(currentUser);

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(readOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
