import { formatDistance } from "date-fns";

export default ({ event, action, errors }) => (
  <div className="col">
    <div className="card shadow-sm">
      <img className="card-img-top" src={event.image} />
      <div className="card-body">
        <p className="card-text">{event.title}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="btn-group">{action}</div>
          <small className="text-body-secondary">
            {formatDistance(event.start, new Date(), { addSuffix: true })}
          </small>
        </div>
      </div>
    </div>
    {errors}
  </div>
);
