import request from "supertest";

import { app } from "../../app";
import { signUp } from "../../test/global";

it("fails when an email that does not exist is supplied", () => {
  return request(app)
    .post("/api/auth/sign-up")
    .send({ email: "test" })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  return signUp();
});
