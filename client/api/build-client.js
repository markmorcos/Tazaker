import axios from "axios";
import https from "https";

export default ({ req }) => {
  const baseURL = {
    development:
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    staging: "https://staging.tazaker.org",
    production: "https://www.tazaker.org",
  }[process.env.ENVIRONMENT];

  if (typeof window === "undefined") {
    return axios.create({
      baseURL,
      headers: req.headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
  }

  return axios.create();
};
