import request from "supertest";

import { app } from "../../../app";
import { signIn } from "../../../test/global";
import { stripe } from "../../../stripe";

test("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/onboarding/account").send({}).expect(401);
});

test("creates an account with valid inputs", async () => {
  const response = await request(app)
    .post("/api/onboarding/account")
    .set("Cookie", await signIn())
    .send()
    .expect(201);

  expect(response.body.id).toBeDefined();
  expect(stripe.accounts.create).toHaveBeenCalled();
});
