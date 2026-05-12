import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.js";

const fixedWindowRateLimiter = (
    windowSizeInSeconds: number,
    maxRequests: number
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const ip = req.ip || "unknown-ip";

            const redisKey = `fixed_window:${req.baseUrl}:${ip}`;

            const requestCount =
                await redisClient.incr(redisKey);

            if (requestCount === 1) {
                await redisClient.expire(
                    redisKey,
                    windowSizeInSeconds
                );
            }

            const remainingRequests = Math.max(
                maxRequests - requestCount,
                0
            );

            res.setHeader(
                "X-RateLimit-Limit",
                maxRequests
            );

            res.setHeader(
                "X-RateLimit-Remaining",
                remainingRequests
            );

            if (requestCount > maxRequests) {
                const ttl =
                    await redisClient.ttl(redisKey);

                res.setHeader("Retry-After", ttl);

                return res.status(429).json({
                    success: false,
                    message: "Too many requests",
                    retryAfter: ttl,
                });
            }

            next();
        } catch (error) {
            console.error(
                "Fixed window rate limiter error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };
};

export default fixedWindowRateLimiter;