import Link from "next/link";

const LandingPage = ({ tickets }) => {
  const ticketList = tickets.map(({ id, title, price }) => (
    <div key={id} className="col">
      <div className="card shadow-sm">
        <img className="card-img-top" src="https://placehold.it/180x100" />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">€{price}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Link className="btn btn-primary btn-sm" href={`/tickets/${id}`}>
                View
              </Link>
            </div>
            <small className="text-body-secondary">2024-01-01</small>
          </div>
        </div>
      </div>
    </div>
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
