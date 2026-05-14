import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import redisClient from "./config/redis.js";

import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";

import slidingWindowRateLimiter from "./middleware/slidingWindowRateLimiter.js";
import tokenBucketRateLimiter from "./middleware/tokenBucketRateLimiter.js";

import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(
    "/auth",
    slidingWindowRateLimiter(60, 3),
    authRoute
);

app.use(
    "/test",
    tokenBucketRateLimiter(5, 1),
    testRoute
);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await redisClient.connect();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server", error);
    }
};

startServer();