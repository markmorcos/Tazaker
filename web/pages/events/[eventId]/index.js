import Router from "next/router";

import useRequest from "../../../hooks/use-request";
import { Button } from "../../../components/button";
import { Link } from "../../../components/link";
import { Breadcrumbs } from "../../../components/breadcrumbs";

import Ticket from "./_components/ticket";
import { Card } from "../../../components/card";

const EventRead = ({ event, tickets }) => (
  <>
    <Breadcrumbs>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/events">Events</Link>
      </li>
      <li className="active">{event.title}</li>
    </Breadcrumbs>
    <div style={{ maxWidth: "50rem" }}>
      <Card>
        <img style={{ objectFit: "cover" }} width="100%" src={event.image} />
        <div className="content">
          <Link href={event.url} target="_blank">
            <h1 className="text">{event.title}</h1>
          </Link>{" "}
          <Link href={`/events/${event.id}/tickets/new`}>
            <Button>Sell a ticket</Button>
          </Link>
        </div>
      </Card>
    </div>
    {tickets.length ? (
      <>
        <br />
        <section style={{ display: "flex", flexWrap: "wrap" }}>
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
                  <Button onClick={() => doRequest()} disabled={loading}>
                    Order
                  </Button>
                }
                errors={errors}
              />
            );
          })}
        </section>
      </>
    ) : null}
  </>
);

EventRead.getInitialProps = async (context, client) => {
  const { eventId } = context.query;

  const { data: event } = await client.get(`/api/events/${eventId}`);
  const { data: tickets } = await client.get(`/api/tickets?eventId=${eventId}`);

  return { event, tickets };
};

export default EventRead;
