import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

let ratelimit = null;

// Validate required environment variables
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn("⚠️  Upstash Redis credentials not found. Rate limiting will be disabled.");
} else {
  try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "20 s"),
      analytics: true,
      prefix: "school-management-api"
    });
  } catch (error) {
    console.error("❌ Failed to initialize rate limiter:", error.message);
  }
}

export default ratelimit;