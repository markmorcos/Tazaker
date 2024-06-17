import { useState } from "react";

import redirect from "../api/redirect";
import useRequest from "../hooks/use-request";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Form } from "../components/form";
import { Title } from "../components/title";

const ProfileIndex = ({ currentUser, wallet }) => {
  const [paypalEmail, setPaypalEmail] = useState(currentUser.paypalEmail);
  const [balance, setBalance] = useState(wallet.balance);

  const updateUser = useRequest({
    url: "/api/auth",
    method: "patch",
    body: { paypalEmail },
  });

  const receivePayout = useRequest({
    url: "/api/payouts",
    method: "post",
    onSuccess: () => setBalance(0),
  });

  const onSubmitUpdateUser = (e) => {
    e.preventDefault();
    updateUser.doRequest();
  };

  return (
    <>
      <section>
        <Title>Wallet</Title>
        <h2>€{balance}</h2>
        {receivePayout.errors}
        <Button
          onClick={() => receivePayout.doRequest()}
          disabled={!balance || receivePayout.loading}
        >
          Receive payout
        </Button>
      </section>
      <hr />
      <Form onSubmit={onSubmitUpdateUser}>
        {updateUser.errors}
        <section>
          <label htmlFor="email">PayPal Email</label>
          <Input
            id="email"
            type="email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            disabled={updateUser.loading}
            $error={updateUser.errors}
          />
          <small>Please make sure it is a valid PayPal email</small>
        </section>
        <Button type="submit" disabled={!paypalEmail || updateUser.loading}>
          Update
        </Button>
      </Form>
    </>
  );
};

ProfileIndex.getInitialProps = async (context, client) => {
  try {
    const { data: wallet } = await client.get("/api/payouts");
    return { wallet };
  } catch (error) {
    return redirect({ context, path: "/" });
  }
};

export default ProfileIndex;
