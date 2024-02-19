import Link from "next/link";
import Router from "next/router";

import useRequest from "../../../hooks/use-request";

import Ticket from "./_components/ticket";

const EventRead = ({ event, tickets }) => (
  <>
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb p-3 bg-body-tertiary rounded-3">
        <li className="breadcrumb-item">
          <Link href="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link href="/events">Events</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {event.title}
        </li>
      </ol>
    </nav>

    <img
      style={{ width: "100%", maxHeight: "50vh", objectFit: "cover" }}
      src={event.image}
    />

    <div className="row row-cols-1 g-3">
      <h1>
        <a href={event.url} target="_blank">
          {event.title}
        </a>{" "}
        <Link
          className="btn btn-primary btn-sm"
          href={`/events/${event.id}/tickets/new`}
        >
          Sell a ticket
        </Link>
      </h1>
    </div>

    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      {tickets.map((ticket) => {
        const { doRequest, loading, errors } = useRequest({
          url: "/api/orders",
          method: "post",
          body: { ticketId: ticket.id },
          onSuccess: ({ id }) => Router.push(`/orders/${id}`),
        });

        return (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            action={
              <button
                className="btn btn-primary btn-sm"
                onClick={() => doRequest()}
                disabled={loading}
              >
                Order
              </button>
            }
            errors={errors}
          />
        );
      })}
    </div>
  </>
);

EventRead.getInitialProps = async (context, client) => {
  const { eventId } = context.query;

  const { data: event } = await client.get(`/api/events/${eventId}`);
  const { data: tickets } = await client.get(`/api/tickets?eventId=${eventId}`);

  return { event, tickets };
};

export default EventRead;
