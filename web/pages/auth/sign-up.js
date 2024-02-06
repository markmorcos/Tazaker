import { useState } from "react";

import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const { doRequest, loading, errors } = useRequest({
    url: "/api/auth/sign-up",
    method: "post",
    body: { email },
    onSuccess: () => setSuccess(true),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  if (success) {
    return (
      <div className="alert alert-success" role="alert">
        Please check your email to complete the login.
      </div>
    );
  }

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
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Sign Up
      </button>
    </form>
  );
};
