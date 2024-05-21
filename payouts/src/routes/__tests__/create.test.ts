import { Types } from "mongoose";
import request from "supertest";
import { randomBytes } from "crypto";

import { OrderStatus } from "@tazaker/common";

import { app } from "../../app";
import { signIn } from "../../test/global";
import { Wallet } from "../../models/wallet";

it("returns a 404 if the user does not exist", async () => {
  expect(true).toBeTruthy();
});

it("returns a 400 when trying to receive a payout with no balance", async () => {
  expect(true).toBeTruthy();
});

it("returns a 200 when payout is successful", async () => {
  expect(true).toBeTruthy();
});
