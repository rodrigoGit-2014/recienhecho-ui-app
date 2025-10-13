export default ({ config }) => ({
  expo: {
    ...config,
    name: "recienhecho-ui-app",
    slug: "recienhecho-ui-app",
    userInterfaceStyle: "automatic",
    extra: {
      API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8080", // solo dev
    },
  },
});
