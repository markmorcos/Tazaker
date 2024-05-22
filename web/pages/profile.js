import { useState } from "react";

import redirect from "../api/redirect";
import useRequest from "../hooks/use-request";

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

  return (
    <div>
      <h1>Wallet</h1>
      <h2>€{balance}</h2>
      {receivePayout.errors}
      <button
        className="btn btn-success"
        onClick={() => receivePayout.doRequest()}
        disabled={receivePayout.loading}
      >
        Receive payout
      </button>
      <hr />
      <form onSubmit={() => updateUser.doRequest()}>
        {updateUser.errors}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            PayPal Email
          </label>
          <input
            id="email"
            className="form-control"
            type="email"
            aria-describedby="emailHelp"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            disabled={updateUser.loading}
          />
          <div id="emailHelp" className="form-text">
            Please make sure it is a valid PayPal email
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={updateUser.loading}
        >
          Update
        </button>
      </form>
    </div>
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
