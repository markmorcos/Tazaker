import { useState } from "react";

import useRequest from "../hooks/use-request";
import { Button } from "../components/button";
import { Form } from "../components/form";
import { Alert } from "../components/alert";
import { Card } from "../components/card";
import { Input } from "../components/input";

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
      <Alert className="success">
        Please check your email to complete the login.
      </Alert>
    );
  }

  return (
    <div style={{ maxWidth: "30rem" }}>
      <Card>
        <div className="content">
          <Form onSubmit={onSubmit}>
            {errors}
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <Input
              id="email"
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <small>We'll never share your email with anyone else.</small>
            <Button type="submit" disabled={loading}>
              Send authentication link
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
};
