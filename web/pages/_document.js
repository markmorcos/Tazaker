import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
  <Html lang="en" data-bs-theme="light">
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
