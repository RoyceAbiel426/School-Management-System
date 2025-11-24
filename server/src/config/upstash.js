import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

let ratelimit = null;

/**
 * Initialize Upstash Redis Rate Limiter
 * This is an async initialization that runs when the module is imported
 */
const initializeRateLimiter = async () => {
  // Skip rate limiting if explicitly disabled
  if (process.env.DISABLE_RATE_LIMITING === "true") {
    console.log("⚠️  Rate limiting is disabled via environment variable");
    return null;
  }

  // Validate required environment variables
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    console.warn(
      "⚠️  Upstash Redis credentials not found. Rate limiting will be disabled."
    );
    console.warn(
      "   Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env"
    );
    return null;
  }

  try {
    // Initialize Redis client
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Test Redis connection with a simple ping
    try {
      const pingResult = await redis.ping();
      console.log("✅ Upstash Redis connection verified:", pingResult);
    } catch (pingError) {
      console.warn("⚠️  Redis ping failed:", pingError.message);
      console.warn("   Rate limiting will be disabled");
      return null;
    }

    // Initialize rate limiter with sliding window algorithm
    const rateLimiter = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 requests per 60 seconds
      analytics: true,
      prefix: "edu-pro-api",
      timeout: 5000, // 5 second timeout
    });

    console.log("✅ Rate limiter initialized successfully");
    console.log("   Limit: 100 requests per 60 seconds");

    return rateLimiter;
  } catch (error) {
    console.error("❌ Failed to initialize rate limiter:", error.message);
    console.warn("⚠️  Continuing without rate limiting...");
    return null;
  }
};

// Initialize rate limiter (returns a Promise)
ratelimit = await initializeRateLimiter();

export default ratelimit;
