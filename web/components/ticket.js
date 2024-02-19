export default ({ ticket, action, errors }) => (
  <div className="col">
    <div className="card shadow-sm">
      <div className="card-body">
        <p className="card-text">€{ticket.price}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="btn-group">{action}</div>
          <small className="text-body-secondary">2024-01-01</small>
        </div>
      </div>
    </div>
    {errors}
  </div>
);
