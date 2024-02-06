import request from "supertest";

import { app } from "../app";
import { User } from "../models/user";

export const signUp = async () => {
  const email = "test@example.com";

  const response = await request(app)
    .post("/api/auth/sign-up")
    .send({ email })
    .expect(200);
  expect(response.body.id).toBeDefined();

  const user = await User.findById(response.body.id);

  const complete = await request(app)
    .get(`/api/auth/complete?email=${user!.email}&code=${user!.code}`)
    .expect(302);
  const cookie = complete.get("Set-Cookie");
  expect(cookie).toBeDefined();

  return cookie;
};

export const signIn = async () => {
  const email = "test@example.com";

  const response = await request(app)
    .post("/api/auth/sign-up")
    .send({ email })
    .expect(200);
  expect(response.body.id).toBeDefined();

  const user = await User.findById(response.body.id);

  const complete = await request(app)
    .get(`/api/auth/complete?email=${user!.email}&code=${user!.code}`)
    .expect(302);
  const cookie = complete.get("Set-Cookie");
  expect(cookie).toBeDefined();

  return cookie;
};
