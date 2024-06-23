import request from "supertest";

import { app } from "../../../app";
import { signUp } from "../../../test/global";

it("responds with null if not authenticated", async () => {
  const response = await request(app).patch("/api/users/current").expect(401);
  expect(response.body.currentUser).toBeUndefined();
});

it("responds with details about the current user", async () => {
  const cookie = await signUp();
  const response = await request(app)
    .patch("/api/users/current")
    .set("Cookie", cookie)
    .send({ paypalEmail: "paypal@example.com" })
    .expect(200);
  expect(response.body.paypalEmail).toEqual("paypal@example.com");
});
