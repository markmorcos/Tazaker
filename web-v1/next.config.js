module.exports = {
  basePath: "/v1",
  distDir: "build",
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  compiler: {
    styledComponents: true,
  },
};
