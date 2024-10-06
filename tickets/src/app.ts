import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorHandler, NotFoundError } from "@tazaker/common";

import { createTicketRouter } from "./routes/create";
import { readTicketRouter } from "./routes/read";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

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

app.use(createTicketRouter);
app.use(indexTicketRouter);
app.use(readTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
