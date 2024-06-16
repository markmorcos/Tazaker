import { formatDistance } from "date-fns";

import { Link } from "../../../components/link";
import { Title } from "../../../components/title";
import { Card } from "../../../components/card";
import { Button } from "../../../components/button";

export default ({ order, currentUser }) => (
  <>
    <Title>Order {order.id}</Title>
    <div style={{ maxWidth: "30rem" }}>
      <Card>
        <div className="content">
          <div>
            <h1 className="text">{order.ticket.event.title}</h1>
            <p>€{order.ticket.price}</p>
            <Link href={`/events/${order.ticket.event.id}`}>
              <Button>View event</Button>
            </Link>
            {order.userId === currentUser?.id &&
              order.status === "complete" && (
                <>
                  &nbsp;
                  <Link
                    href={`/api/tickets/${order.ticket.id}/file`}
                    about="_blank"
                  >
                    <Button>Download</Button>
                  </Link>
                </>
              )}
          </div>
          <small>
            {formatDistance(order.ticket.event.start, new Date(), {
              addSuffix: true,
            })}
          </small>
        </div>
      </Card>
    </div>
  </>
);
