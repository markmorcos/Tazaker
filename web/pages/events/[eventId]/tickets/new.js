import { useState } from "react";
import Router from "next/router";

import useRequest from "../../../../hooks/use-request";
import { Button } from "../../../../components/button";
import { Link } from "../../../../components/link";
import { Breadcrumbs } from "../../../../components/breadcrumbs";
import { Card } from "../../../../components/card";
import { Form } from "../../../../components/form";
import { Input } from "../../../../components/input";

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
      <Breadcrumbs>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/events">Events</Link>
        </li>
        <li>
          <Link href={`/events/${event.id}`}>{event.title}</Link>
        </li>
        <li className="active">Sell a ticket</li>
      </Breadcrumbs>

      <div style={{ maxWidth: "30rem" }}>
        <Card>
          <div className="content">
            <Form onSubmit={onSubmit}>
              <label htmlFor="price">Price (€)</label>
              <Input
                id="price"
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={onBlur}
                disabled={loading}
              />
              <label htmlFor="file">Ticket (PDF)</label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setFile(e.target.files[0])}
                disabled={loading}
              />
              {errors}
              <Button type="submit" disabled={loading}>
                Create
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
};

NewTicket.getInitialProps = async (context, client) => {
  const { eventId } = context.query;

  const { data: event } = await client.get(`/api/events/${eventId}`);

  return { event };
};

export default NewTicket;
