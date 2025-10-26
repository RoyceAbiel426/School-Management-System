import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

let ratelimit = null;

// Skip rate limiting if disabled in environment
if (process.env.DISABLE_RATE_LIMITING === "true") {
  console.log("⚠️  Rate limiting is disabled via environment variable");
}
// Validate required environment variables
else if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  console.warn(
    "⚠️  Upstash Redis credentials not found. Rate limiting will be disabled."
  );
} else {
  try {
    // Test Redis connection first
    const redis = Redis.fromEnv();

    ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, "20 s"),
      analytics: true,
      prefix: "school-management-api",
    });

    console.log("✅ Rate limiter initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize rate limiter:", error.message);
    console.warn("⚠️  Continuing without rate limiting...");
    ratelimit = null;
  }
}

export default ratelimit;
