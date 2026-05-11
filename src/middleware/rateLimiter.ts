import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.js";

const rateLimiter = (
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

      const requestCount = await redisClient.incr(ip);

      const remainingRequests = Math.max(
        maxRequests - requestCount,
        0
      );

      res.setHeader("X-RateLimit-Limit", maxRequests);

      res.setHeader(
        "X-RateLimit-Remaining",
        remainingRequests
      );

      console.log(ip, requestCount);

      if (Number(requestCount) === 1) {
        await redisClient.expire(ip, windowSizeInSeconds);
      }

      if (requestCount > maxRequests) {
        const ttl = await redisClient.ttl(ip);

        res.setHeader("Retry-After",ttl);
        
        return res.status(429).json({
          success: false,
          message: "Too many requests",
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

export default rateLimiter;