import Link from "next/link";

export default ({ currentUser }) => {
  const links = currentUser
    ? [
        { label: "Orders", href: "/orders" },
        { label: "Sell a Ticket", href: "/tickets/new" },
        { label: "Sign Out", href: "/auth/sign-out" },
      ]
    : [{ label: "Start", href: "/auth/sign-up" }];

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary navbar-fixed">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          Tazaker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {links.map(({ label, href }) => (
              <li key={href} className="nav-item">
                <Link className="nav-link" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
