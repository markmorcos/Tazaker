import axios from "axios";
import https from "https";

export default ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "https://www.tazaker.org",
      headers: req.headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
  }

  return axios.create();
};
