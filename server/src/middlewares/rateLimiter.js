import ratelimit from "../config/upstash.js";

/**
 * Rate Limiter Middleware
 * Uses Upstash Redis with sliding window algorithm
 * Falls back gracefully if rate limiting is unavailable
 */
const rateLimiter = async (req, res, next) => {
  // Skip rate limiting if disabled or not configured
  if (process.env.DISABLE_RATE_LIMITING === "true" || !ratelimit) {
    return next();
  }

  try {
    // Use IP address, forwarded IP, or user ID for rate limiting
    const identifier =
      req.user?.id || // Authenticated user ID (if available)
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown";

    const { success, limit, reset, remaining, pending } = await ratelimit.limit(
      identifier
    );

    // Wait for pending operations if any
    if (pending) {
      await pending;
    }

    // Add rate limit headers to response
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, remaining));
    res.setHeader("X-RateLimit-Reset", new Date(reset).toISOString());

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      res.setHeader("Retry-After", retryAfter);

      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
        retryAfter: `${retryAfter} seconds`,
        limit,
        remaining: 0,
      });
    }

    next();
  } catch (error) {
    // Handle network/connection errors gracefully
    if (error.code === "ENOTFOUND" || error.cause?.code === "ENOTFOUND") {
      console.warn(
        "⚠️  Rate limiter connection failed. Continuing without rate limiting..."
      );
    } else if (
      error.name === "AbortError" ||
      error.message?.includes("timeout")
    ) {
      console.warn(
        "⚠️  Rate limiter timeout. Continuing without rate limiting..."
      );
    } else {
      console.error("❌ Rate limiter error:", error.message);
    }

    // Continue without rate limiting if there's an error
    next();
  }
};

/**
 * Strict Rate Limiter for sensitive endpoints (e.g., login, register)
 * More restrictive limits to prevent abuse
 */
export const strictRateLimiter = async (req, res, next) => {
  // Skip if disabled or not configured
  if (process.env.DISABLE_RATE_LIMITING === "true" || !ratelimit) {
    return next();
  }

  try {
    const identifier =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      "unknown";

    // Use a stricter rate limit for authentication endpoints
    // 5 requests per 60 seconds per IP
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `strict:${identifier}`,
      { rate: 5, window: "60 s" }
    );

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, remaining));
    res.setHeader("X-RateLimit-Reset", new Date(reset).toISOString());

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      res.setHeader("Retry-After", retryAfter);

      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again later.",
        retryAfter: `${retryAfter} seconds`,
      });
    }

    next();
  } catch (error) {
    console.error("❌ Strict rate limiter error:", error.message);
    // Continue without rate limiting on error
    next();
  }
};

export default rateLimiter;
