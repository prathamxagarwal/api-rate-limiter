import express from "express";
import dotenv from "dotenv";

import redisClient from "./config/redis.js";

import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";

import slidingWindowRateLimiter
from "./middleware/slidingWindowRateLimiter.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
    "/auth",
    slidingWindowRateLimiter(60, 3),
    authRoute
);

app.use(
    "/test",
    slidingWindowRateLimiter(60, 5),
    testRoute
);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await redisClient.connect();

        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Failed to start server",
            error
        );
    }
};

startServer();