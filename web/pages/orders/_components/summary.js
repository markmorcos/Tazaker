import Link from "next/link";

export default ({ order }) => (
  <>
    <h1>Order summary</h1>
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{order.ticket.title}</h5>
            <p className="card-text">€{order.ticket.price}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/tickets/${order.ticket.id}`}
                >
                  View
                </Link>
              </div>
              <small className="text-body-secondary">2024-01-01</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
