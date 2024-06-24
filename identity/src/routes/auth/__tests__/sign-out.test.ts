import request from "supertest";

import { app } from "../../../app";
import { signUp } from "../../../test/global";

it("clears the cookie after signing out", async () => {
  await signUp();
  const response = await request(app).post("/api/auth/sign-out").expect(204);
  expect(response.get("Set-Cookie")).toBeUndefined();
});
