import { useState } from "react";
import Link from "next/link";
import Router from "next/router";

import useRequest from "../../../../hooks/use-request";

const NewTicket = ({ event }) => {
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const body = new FormData();
  body.append("eventId", event.id);
  body.append("price", price);
  body.append("file", file);

  const { doRequest, loading, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body,
    headers: { "Content-Type": "multipart/form-data" },
    onSuccess: () => Router.push(`/events/${event.id}`),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (!isNaN(value)) {
      setPrice(value.toFixed(2));
    }
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb p-3 bg-body-tertiary rounded-3">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/events">Events</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/events/${event.id}`}>{event.title}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Sell a ticket
          </li>
        </ol>
      </nav>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price (€)
          </label>
          <input
            id="price"
            className="form-control"
            type="number"
            required
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            Ticket (PDF)
          </label>
          <input
            id="file"
            className="form-control"
            type="file"
            accept=".pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Create
        </button>
      </form>
    </>
  );
};

NewTicket.getInitialProps = async (context, client) => {
  const { eventId } = context.query;

  const { data: event } = await client.get(`/api/events/${eventId}`);

  return { event };
};

export default NewTicket;
