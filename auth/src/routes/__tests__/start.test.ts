import request from "supertest";

import { app } from "../../app";
import { signUp } from "../../test/global";

it("fails when an invalid email is supplied", () => {
  return request(app)
    .post("/api/auth/start")
    .send({ email: "test" })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  return signUp();
});
