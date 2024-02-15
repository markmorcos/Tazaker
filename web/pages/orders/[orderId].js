import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Router from "next/router";

import redirect from "../../api/redirect";
import useRequest from "../../hooks/use-request";
import config from "../../utilities/config";

import Loading from "./_components/loading";
import OrderSummary from "./_components/summary";

const OrderRead = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, loading, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: () => Router.reload(),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000 / 60));
    };

    findTimeLeft();
    const interval = setInterval(findTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (order.status === "complete") {
    return <OrderSummary order={order} />;
  }

  if (timeLeft <= 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <PayPalScriptProvider
        options={{
          clientId: config.paypalClientId,
          currency: "EUR",
          intent: "capture",
        }}
      >
        <PayPalButtons
          displayOnly={["vaultable"]}
          createOrder={(data, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  amount: { currency_code: "EUR", value: order.ticket.price },
                  description: order.ticket.title,
                },
              ],
            })
          }
          onApprove={({ orderID: paypalOrderId }) =>
            doRequest({ paypalOrderId })
          }
        />
      </PayPalScriptProvider>
      <p>Time left to pay: {timeLeft} minutes </p>
      {errors}
    </div>
  );
};

OrderRead.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  try {
    const { data: order } = await client.get(`/api/orders/${orderId}`);
    return { order };
  } catch (error) {
    return redirect({ context, path: "/orders" });
  }
};

export default OrderRead;
