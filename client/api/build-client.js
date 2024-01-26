import axios from "axios";
import https from "https";

export default ({ req }) => {
  const baseURL = {
    production: "https://www.tazaker.org",
    development: "https://staging.tazaker.org",
  }[process.env.NODE_ENV];

  if (typeof window === "undefined") {
    return axios.create({
      baseURL,
      headers: req.headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
  }

  return axios.create();
};
