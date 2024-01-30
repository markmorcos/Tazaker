import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Link from "next/link";
import Router from "next/router";

import redirect from "../../api/redirect";
import useRequest from "../../hooks/use-request";
import config from "../../utilities/config";
import Ticket from "../../components/ticket";

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
    return <div>Loading...</div>;
  }

  if (order.status === "complete") {
    return (
      <>
        <h1>Order summary</h1>
        <Ticket
          ticket={order.ticket}
          action={
            <Link
              className="btn btn-primary btn-sm"
              href={`/tickets/${order.ticket.id}`}
            >
              View
            </Link>
          }
        />
      </>
    );
  }

  if (timeLeft <= 0) {
    return <div>Order expired</div>;
  }

  console.log(config);

  return (
    <div>
      <StripeCheckout
        token={({ id: token }) => doRequest({ token })}
        stripeKey={config.stripePublishableKey}
        amount={order.ticket.price * 100}
        currency="EUR"
        email={currentUser.email}
      />
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
