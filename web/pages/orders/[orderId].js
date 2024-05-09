import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from "next/link";
import Router from "next/router";

import redirect from "../../api/redirect";
import useRequest from "../../hooks/use-request";
import config from "../../utilities/config";

import Loading from "./_components/loading";
import OrderSummary from "./_components/summary";

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
        <div className="alert alert-danger" role="alert">
          This order has expired. Please go back to the{" "}
          <Link href={`/events/${order.ticket.event.id}`}>event page</Link> and
          start a new order.
        </div>
        <OrderSummary order={order} />
      </>
    );
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb p-3 bg-body-tertiary rounded-3">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/events">Events</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/events/${order.ticket.event.id}`}>
              {order.ticket.event.title}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Order
          </li>
        </ol>
      </nav>
      <div className="alert alert-warning" role="alert">
        Time left to pay: {timeLeft} minutes
      </div>
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
                { amount: { currency_code: "EUR", value: order.ticket.price } },
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
