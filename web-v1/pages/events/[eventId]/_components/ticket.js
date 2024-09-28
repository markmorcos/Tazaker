import { Card } from "../../../../components/card";

export default ({ ticket, action, errors }) => (
  <div style={{ maxWidth: "20rem" }}>
    <Card>
      <div className="content">
        {errors}
        <p className="text">
          €{ticket.price} <i>(price)</i> + €
          {Math.round(100 * (ticket.price * 0.05 + 0.5)) / 100}{" "}
          <i>(platform fees)</i>
        </p>
        <div>{action}</div>
      </div>
    </Card>
  </div>
);
