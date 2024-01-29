import Link from "next/link";
import Ticket from "../components/ticket";

const LandingPage = ({ tickets }) => {
  const ticketList = tickets.map((ticket) => (
    <Ticket
      key={ticket.id}
      ticket={ticket}
      action={
        <Link className="btn btn-primary btn-sm" href={`/tickets/${ticket.id}`}>
          View
        </Link>
      }
    />
  ));

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      {ticketList}
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data: tickets } = await client.get("/api/tickets");
  return { tickets };
};

export default LandingPage;
