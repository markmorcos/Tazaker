import Router from "next/router";

import useRequest from "../../hooks/use-request";

const TicketRead = ({ ticket }) => {
  const { doRequest, loading, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: ({ id }) => Router.push(`/orders/${id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: €{ticket.price}</h4>
      {errors}
      {!ticket.orderId && (
        <button
          className="btn btn-primary"
          onClick={() => doRequest()}
          disabled={loading}
        >
          Buy
        </button>
      )}
    </div>
  );
};

TicketRead.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data: ticket } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket };
};

export default TicketRead;
