import Router from "next/router";

export default function ({ context, path }) {
  if (typeof window === "undefined") {
    context.res.writeHead(302, { Location: path });
    context.res.end();
  } else {
    Router.replace(path);
  }

  return {};
}
