import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.js";

const slidingWindowRateLimiter = (
    windowSizeInSeconds: number,
    maxRequests: number
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const redisKey = "sliding_window_global";

            const currentTime = Date.now();
            const windowStart =
                currentTime - windowSizeInSeconds * 1000;

            await redisClient.zRemRangeByScore(
                redisKey,
                0,
                windowStart
            );

            const requestCount =
                await redisClient.zCard(redisKey);

            res.setHeader("X-RateLimit-Limit", maxRequests);
            res.setHeader(
                "X-RateLimit-Remaining",
                Math.max(maxRequests - requestCount, 0)
            );

            if (requestCount >= maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests",
                });
            }

            await redisClient.zAdd(redisKey, {
                score: currentTime,
                value: `${currentTime}-${Math.random()}`,
            });

            await redisClient.expire(
                redisKey,
                windowSizeInSeconds
            );

            next();
        } catch (error) {
            console.error(
                "Sliding window rate limiter error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };
};

export default slidingWindowRateLimiter;