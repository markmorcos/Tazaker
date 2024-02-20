export default ({ ticket, action, errors }) => (
  <div className="col">
    <div className="card shadow-sm">
      <div className="card-body">
        {errors}
        <p className="card-text">€{ticket.price}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="btn-group">{action}</div>
        </div>
      </div>
    </div>
  </div>
);
