import Link from "next/link";
import Event from "../../components/event";

const LandingPage = ({ events }) => {
  const eventList = events.map((event) => (
    <Event
      key={event.id}
      event={event}
      action={
        <Link className="btn btn-primary btn-sm" href={`/events/${event.id}`}>
          View
        </Link>
      }
    />
  ));

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb p-3 bg-body-tertiary rounded-3">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Events
          </li>
        </ol>
      </nav>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {eventList}
      </div>
    </>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data: events } = await client.get("/api/events");
  return { events };
};

export default LandingPage;
