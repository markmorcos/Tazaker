import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Router from "next/router";

import redirect from "../../api/redirect";
import useRequest from "../../hooks/use-request";
import config from "../../utilities/config";
import { Link } from "../../components/link";

import Loading from "./_components/loading";
import OrderSummary from "./_components/summary";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { Alert } from "../../components/alert";

const OrderRead = ({ order, currentUser }) => {
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
    return <OrderSummary order={order} currentUser={currentUser} />;
  }

  if (timeLeft <= 0) {
    return (
      <>
        <Alert className="danger">
          This order has expired. Please go back to the{" "}
          <Link href={`/events/${order.ticket.event.id}`}>event page</Link> and
          start a new order.
        </Alert>
        <OrderSummary order={order} />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/events">Events</Link>
        </li>
        <li>
          <Link href={`/events/${order.ticket.event.id}`}>
            {order.ticket.event.title}
          </Link>
        </li>
        <li className="active">Order</li>
      </Breadcrumbs>
      <Alert className="warning">Time left to pay: {timeLeft} minutes</Alert>
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
                  amount: {
                    currency_code: "EUR",
                    value:
                      Math.round(100 * (order.ticket.price * 1.05 + 0.5)) / 100,
                  },
                },
              ],
            })
          }
          onApprove={({ orderID: paypalOrderId }) =>
            doRequest({ paypalOrderId })
          }
        />
      </PayPalScriptProvider>
      {errors}
    </>
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
