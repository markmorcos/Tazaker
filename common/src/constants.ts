export const baseURL = {
  development: "http://tazaker.dev",
  staging: "https://www.staging.tazaker.org",
  production: "https://www.tazaker.org",
}[process.env.ENVIRONMENT!];
