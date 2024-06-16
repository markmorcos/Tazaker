import { Link } from "../components/link";

const LandingPage = () => (
  <section className="home">
    <Link href="/events">
      <h1>Events</h1>
    </Link>
  </section>
);

LandingPage.getInitialProps = async (context, client) => {
  return {};
};

export default LandingPage;
