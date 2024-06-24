import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import redirect from "../../api/redirect";
import { Link } from "../../components/link";

import OrderSummary from "./_components/summary";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { Alert } from "../../components/alert";

const OrderRead = ({ order, currentUser }) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    { stripeAccount: order.ticket.user.stripeAccountId }
  );

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000 / 60));
    };

    findTimeLeft();
    const interval = setInterval(findTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

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
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret: order.clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
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
