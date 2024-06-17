import "./index.css";

import Head from "next/head";

import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => (
  <>
    <Head>
      <title>Tazaker</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Header currentUser={currentUser} />
    <main className="app">
      <Component {...pageProps} currentUser={currentUser} />
    </main>
  </>
);

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
