import Router from "next/router";

import useRequest from "../../hooks/use-request";
import Ticket from "../../components/ticket";

const TicketRead = ({ ticket }) => {
  const { doRequest, loading, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: ({ id }) => Router.push(`/orders/${id}`),
  });

  return (
    <>
      <Ticket
        ticket={ticket}
        action={
          <button
            className="btn btn-primary btn-sm"
            onClick={() => doRequest()}
            disabled={loading}
          >
            Buy
          </button>
        }
        errors={errors}
      />
    </>
  );
};

TicketRead.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data: ticket } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket };
};

export default TicketRead;
