module.exports = {
  basePath: "/v1",
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  compiler: {
    styledComponents: true,
  },
};
