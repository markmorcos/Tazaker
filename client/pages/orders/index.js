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
    ({ id, ticket: { id: ticketId, title }, status }) => (
      <tr key={id}>
        <td>
          <Link href={`/tickets/${ticketId}`}>{title}</Link>
        </td>
        <td>
          <Link href={`/orders/${id}`}>
            <span
              className={`badge rounded-pill text-bg-${statuses[status].background}`}
            >
              {statuses[status].title}
            </span>
          </Link>
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
            <th>Ticket</th>
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
