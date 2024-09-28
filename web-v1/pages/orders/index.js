import { OrderStatus } from "@tazaker/common";

import redirect from "../../api/redirect";
import { Link } from "../../components/link";
import { Table } from "../../components/table";
import { Title } from "../../components/title";

const statuses = {
  [OrderStatus.Created]: { title: "Started", background: "primary" },
  [OrderStatus.Expired]: { title: "Expired", background: "danger" },
  [OrderStatus.Complete]: { title: "Complete", background: "success" },
};

const OrdersIndex = ({ orders }) => {
  return (
    <div>
      <Title>Orders</Title>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Price</th>
            <th>Event</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, ticket, status }) => (
            <tr key={id}>
              <td>
                <Link href={`/orders/${id}`}>{id}</Link>
              </td>
              <td>€{ticket.price}</td>
              <td>
                <Link href={`/events/${ticket.event.id}`}>
                  {ticket.event.title}
                </Link>
              </td>
              <td>
                <span className={`badge ${statuses[status].background}`}>
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
