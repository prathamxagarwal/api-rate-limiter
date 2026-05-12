import express from "express";
import redisClient from "./config/redis.js";
import testRoute from "./routes/testRoute.js"
import rateLimiter from "./middleware/rateLimiter.js";
import authRoute from "./routes/authRoute.js";
import slidingWindowRateLimiter from "./middleware/slidingWindowRateLimiter.js";

const app = express();

//app.use(slidingWindowRateLimiter(60,5));
app.use(
  "/auth",
  slidingWindowRateLimiter(60, 3),
  authRoute
);
app.use("/test",testRoute);

const startServer = async ()=>{
    try{
        await redisClient.connect();

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });

    } catch(error){
        console.error("Failed to start server",error);
    }
};

startServer(); 