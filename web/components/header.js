import Link from "next/link";
import Router from "next/router";

import useRequest from "../hooks/use-request";

export default ({ currentUser }) => {
  const { doRequest: signOut } = useRequest({
    url: "/api/auth/sign-out",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  const links = currentUser
    ? [
        { label: "Events", href: "/events" },
        { label: "Orders", href: "/orders" },
      ]
    : [{ label: "Start", href: "/start" }];

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
            <li className="nav-item">
              {currentUser && (
                <button className="nav-link" onClick={() => signOut()}>
                  Sign Out
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
