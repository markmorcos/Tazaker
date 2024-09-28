import { Breadcrumbs } from "../../components/breadcrumbs";
import { Link } from "../../components/link";

import Event from "./_components/event";

const LandingPage = ({ events }) => (
  <>
    <Breadcrumbs className="breadcrumb">
      <li>
        <Link href="/">Home</Link>
      </li>
      <li className="active">Events</li>
    </Breadcrumbs>
    <section style={{ display: "flex", flexWrap: "wrap" }}>
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </section>
  </>
);

LandingPage.getInitialProps = async (context, client) => {
  const { data: events } = await client.get("/api/events");
  return { events };
};

export default LandingPage;
