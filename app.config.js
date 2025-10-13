export default {
    expo: {
        name: "recienhecho-ui-app",
        slug: "recienhecho-ui-app",
        extra: {
            API_BASE_URL: process.env.API_BASE_URL || "https://recienhecho-service-production.up.railway.app",
        },
    },
};
