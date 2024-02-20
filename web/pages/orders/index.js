import Link from "next/link";
import Table from "react-bootstrap/Table";

import { OrderStatus } from "@tazaker/common";

import redirect from "../../api/redirect";

const statuses = {
  [OrderStatus.Created]: { title: "Started", background: "primary" },
  [OrderStatus.Expired]: { title: "Expired", background: "danger" },
  [OrderStatus.Complete]: { title: "Complete", background: "success" },
};

const OrdersIndex = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      <Table responsive>
        <thead>
          <tr>
            <th>Event</th>
            <th>Price</th>
            <th>Order</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, ticket, status }) => (
            <tr key={id}>
              <td>
                <Link href={`/events/${ticket.event.id}`}>
                  {ticket.event.title}
                </Link>
              </td>
              <td>€{ticket.price}</td>
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
          ))}
        </tbody>
      </Table>
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
