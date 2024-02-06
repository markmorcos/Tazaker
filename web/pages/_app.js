import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { useEffect } from "react";
import Head from "next/head";

import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div>
      <Head>
        <title>Tazaker</title>
      </Head>
      <Header currentUser={currentUser} />
      <div className="container py-5">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);

  let currentUser;
  try {
    const response = await client.get("/api/auth/current-user");
    currentUser = response.data.currentUser;
  } catch (error) {}
  const pageProps = await Component.getInitialProps?.(ctx, client, currentUser);

  return { pageProps, currentUser };
};

export default AppComponent;
