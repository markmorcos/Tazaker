import { formatDistance } from "date-fns";
import Link from "next/link";

export default ({ order, currentUser }) => (
  <>
    <h1>Order {order.id}</h1>
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{order.ticket.event.title}</h5>
            <h5 className="card-text">€{order.ticket.price}</h5>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/events/${order.ticket.event.id}`}
                >
                  View event
                </Link>
                {order.userId === currentUser?.id &&
                  order.status === "complete" && (
                    <Link
                      className="btn btn-success btn-sm"
                      href={`/api/tickets/${order.ticket.id}/file`}
                      about="_blank"
                    >
                      Download
                    </Link>
                  )}
              </div>
              <small className="text-body-secondary">
                {formatDistance(order.ticket.event.start, new Date(), {
                  addSuffix: true,
                })}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
