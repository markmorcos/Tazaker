import { useEffect, useState } from "react";
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
  ConnectAccountManagement,
  ConnectNotificationBanner,
  ConnectPayouts,
} from "@stripe/react-connect-js";

import { Button } from "../components/button";
import { Title } from "../components/title";
import useStripeConnect from "../hooks/use-stripe-connect";

const ProfileIndex = ({ currentUser }) => {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountDeletePending, setAccountDeletePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const stripeConnectInstance = useStripeConnect(connectedAccountId);
  const [dueRequirements, setDueRequirements] = useState(false);

  const fetchAccount = () => {
    setAccountCreatePending(true);
    setError(false);
    return fetch("/api/onboarding/account", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((account) => {
        setAccountCreatePending(false);
        if (account) {
          setConnectedAccountId(account.id);
          setDueRequirements(account.requirements.eventually_due.length);
        }
      })
      .catch(setError);
  };

  useEffect(() => {
    if (currentUser.stripeAccountId) {
      fetchAccount();
    }
  }, []);

  return (
    <div className="container">
      <div className="banner">
        <Title>Profile</Title>
      </div>
      <div className="content">
        {error && <p className="error">Something went wrong!</p>}

        {!connectedAccountId && <h2>Get ready to sell tickets</h2>}
        {connectedAccountId && !stripeConnectInstance && (
          <h2>Add information to start accepting money</h2>
        )}
        {!connectedAccountId && (
          <p>
            Tazaker is the secure ticket resale platform: join our team of
            sellers in order to start posting your tickets.
          </p>
        )}
        {!accountCreatePending && !connectedAccountId && (
          <div>
            <Button onClick={fetchAccount}>Create Stripe account</Button>
          </div>
        )}
        {stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            {dueRequirements ? (
              <ConnectAccountOnboarding
                onExit={() => setOnboardingExited(true)}
              />
            ) : (
              <>
                <div style={{ marginBottom: "2rem" }}>
                  <ConnectNotificationBanner
                    collectionOptions={{
                      fields: "eventually_due",
                      futureRequirements: "include",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "2rem" }}>
                  <ConnectAccountManagement />
                </div>
                <div style={{ marginBottom: "2rem" }}>
                  <ConnectPayouts />
                </div>
              </>
            )}
          </ConnectComponentsProvider>
        )}
        {(connectedAccountId || accountCreatePending || onboardingExited) && (
          <div className="dev-callout">
            {connectedAccountId && (
              <p>
                Your connected account ID is:{" "}
                <code className="bold">{connectedAccountId}</code>{" "}
                <Button
                  onClick={async () => {
                    if (
                      confirm(
                        "Are you sure you want to delete your Stripe account?"
                      )
                    ) {
                      setAccountDeletePending(true);
                      setError(false);
                      fetch("/api/onboarding/account", {
                        method: "DELETE",
                      })
                        .then((response) => response.json())
                        .then(() => {
                          setAccountDeletePending(false);
                          setConnectedAccountId(null);
                        })
                        .catch(setError);
                    }
                  }}
                >
                  Delete account
                </Button>
              </p>
            )}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountDeletePending && <p>Deleting connected account...</p>}
            {onboardingExited && (
              <p>The Account Onboarding component has exited</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileIndex;
