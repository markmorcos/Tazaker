import Router from "next/router";

import useRequest from "../hooks/use-request";

import { Navbar } from "./navbar";
import { Button } from "./button";
import { Link } from "./link";

export default ({ currentUser }) => {
  const router = Router.useRouter();
  const { doRequest: signOut } = useRequest({
    url: "/api/auth/sign-out",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  const links = currentUser
    ? [
        { label: "Profile", href: "/profile" },
        { label: "Events", href: "/events" },
        { label: "Orders", href: "/orders" },
      ]
    : [{ label: "Start", href: "/start" }];

  return (
    <Navbar>
      <Link className="logo" href="/">
        Tazaker
      </Link>
      <div
        className="burger"
        onClick={() =>
          document.querySelector("ul#nav").classList.toggle("open")
        }
      >
        <Button $secondary="true">☰</Button>
      </div>
      <ul id="nav" role="list">
        {links.map(({ label, href }) => (
          <li
            key={href}
            {...(router.pathname.startsWith(href)
              ? { className: "active" }
              : {})}
          >
            <Link href={href}>{label}</Link>
          </li>
        ))}
        {currentUser && (
          <li>
            <Button $secondary="true" onClick={() => signOut()}>
              Sign Out ({currentUser.email})
            </Button>
          </li>
        )}
      </ul>
    </Navbar>
  );
};
