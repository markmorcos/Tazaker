import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
  <Html lang="en" data-bs-theme="dark">
    <Head>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Dancing+Script"
      ></link>
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
