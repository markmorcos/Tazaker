import { formatDistance } from "date-fns";

import { Link } from "../../../components/link";
import { Card } from "../../../components/card";

export default ({ event, errors }) => (
  <Link href={`/events/${event.id}`}>
    <div style={{ maxWidth: "30rem" }}>
      <Card>
        <img className="image" width="100%" src={event.image} />
        <div className="content">
          <h1 className="text">{event.title}</h1>
          <small>
            {formatDistance(event.start, new Date(), { addSuffix: true })}
          </small>
        </div>
      </Card>
      {errors}
    </div>
  </Link>
);
