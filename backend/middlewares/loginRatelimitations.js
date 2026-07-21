import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {redis} from "../index.js";

const loginRateLimitations = asyncHandler(async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const key = `rate_limit:${ip}`;

    const requests = await redis.incr(key);

    if (requests === 1) {
      await redis.expire(key, 60); // 3 minutes
    }

    if (requests > 5) {
      return res.status(429).json({
        message: "Too many requests",
      });
    }

    
    res.setHeader("X-RateLimit-Limit", 5);
    res.setHeader("X-RateLimit-Remaining", 5 - requests);

    next();
  } catch (error) {
    throw new ApiError(500,"Rate limit error:", error);
    next(); 
  }
});

export default loginRateLimitations;


