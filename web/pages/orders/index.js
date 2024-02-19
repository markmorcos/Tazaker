import Link from "next/link";

import { OrderStatus } from "@tazaker/common";

import redirect from "../../api/redirect";

const statuses = {
  [OrderStatus.Created]: { title: "Started", background: "primary" },
  [OrderStatus.AwaitingPayment]: {
    title: "Awaiting payment",
    background: "secondary",
  },
  [OrderStatus.Expired]: { title: "Expired", background: "danger" },
  [OrderStatus.Cancelled]: { title: "Cancelled", background: "danger" },
  [OrderStatus.Complete]: { title: "Complete", background: "success" },
};

const OrdersIndex = ({ orders }) => {
  const orderList = orders.map(
    ({
      id,
      ticket: {
        event: { id: eventId, title },
        price,
      },
      status,
    }) => (
      <tr key={id}>
        <td>
          <Link href={`/events/${eventId}`}>{title}</Link>
        </td>
        <td>€{price}</td>
        <td>
          <Link href={`/orders/${id}`}>{id}</Link>
        </td>
        <td>
          <span
            className={`badge rounded-pill text-bg-${statuses[status].background}`}
          >
            {statuses[status].title}
          </span>
        </td>
      </tr>
    )
  );

  return (
    <div>
      <h1>Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Price</th>
            <th>Order</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

OrdersIndex.getInitialProps = async (context, client) => {
  try {
    const { data: orders } = await client.get("/api/orders");
    return { orders };
  } catch (error) {
    return redirect({ context, path: "/" });
  }
};

export default OrdersIndex;
