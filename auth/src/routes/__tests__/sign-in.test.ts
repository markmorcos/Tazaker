import request from "supertest";

import { app } from "../../app";
import { signIn } from "../../test/global";

it("fails when an email that does not exist is supplied", () => {
  return request(app)
    .post("/api/auth/sign-in")
    .send({ email: "test" })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  return signIn();
});
