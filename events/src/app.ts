import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@tazaker/common";

import { createEventRouter } from "./routes/create";
import { readEventRouter } from "./routes/read";
import { indexEventRouter } from "./routes/index";
import { updateEventRouter } from "./routes/update";

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

app.use(createEventRouter);
app.use(readEventRouter);
app.use(indexEventRouter);
app.use(updateEventRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
