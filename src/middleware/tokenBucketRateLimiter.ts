import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.js";

const tokenBucketRateLimiter = (
    capacity: number,
    refillRate: number
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            // simple stable key (no IP/header confusion)
            const redisKey = "token_bucket_global";

            const now = Date.now();

            const data = await redisClient.hGetAll(redisKey);

            let tokens = capacity;
            let lastRefillTime = now;

            if (data.tokens && data.lastRefillTime) {
                tokens = parseFloat(data.tokens);
                lastRefillTime = parseInt(data.lastRefillTime);
            }

            const timeElapsed = (now - lastRefillTime) / 1000;

            const tokensToAdd = Math.floor(timeElapsed * refillRate);

            if (tokensToAdd > 0) {
                tokens = Math.min(capacity, tokens + tokensToAdd);

                lastRefillTime =
                    lastRefillTime +
                    (tokensToAdd / refillRate) * 1000;
            }

            if (tokens < 1) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests",
                });
            }

            tokens -= 1;

            await redisClient.hSet(redisKey, {
                tokens: tokens.toString(),
                lastRefillTime: lastRefillTime.toString(),
            });

            await redisClient.expire(redisKey, 60);

            res.setHeader("X-RateLimit-Limit", capacity);
            res.setHeader(
                "X-RateLimit-Remaining",
                Math.floor(tokens)
            );

            next();
        } catch (error) {
            console.error(
                "Token bucket rate limiter error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };
};

export default tokenBucketRateLimiter;