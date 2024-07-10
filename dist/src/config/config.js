import dotenv from "dotenv";
dotenv.config();
const config = {
    server: {
        port: process.env.PORT || 3000,
        appEnv: process.env.NODE_ENV || "development",
        persistence: process.env.PERSISTENCE || "MONGO",
    },
    mongo: {
        url: process.env.MONGO_URL || "",
        test: process.env.MONGO_TEST_URL || "",
    },
};
export default config;
