import axios from "axios";
import https from "https";

export default ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        process.env.NODE_ENV === "production"
          ? "https://www.tazaker.org"
          : "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
      ...(process.env.NODE_ENV === "production"
        ? { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
        : {}),
    });
  }

  return axios.create();
};
