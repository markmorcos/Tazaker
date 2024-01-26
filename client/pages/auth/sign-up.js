import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, loading, errors } = useRequest({
    url: "/api/users/sign-up",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      {errors}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          className="form-control"
          type="email"
          aria-describedby="emailHelp"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <div id="emailHelp" className="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Sign Up
      </button>
    </form>
  );
};
