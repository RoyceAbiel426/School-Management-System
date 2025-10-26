import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  // Skip rate limiting if disabled in environment or not configured
  if (process.env.DISABLE_RATE_LIMITING === "true" || !ratelimit) {
    return next();
  }

  try {
    // Use IP address or user ID for rate limiting
    const identifier = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const { success, limit, reset, remaining } = await ratelimit.limit(
      identifier
    );

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
        retryAfter: reset,
        limit,
        remaining: 0,
      });
    }

    // Add rate limit headers
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    next();
  } catch (error) {
    // Handle network/connection errors gracefully
    if (error.code === "ENOTFOUND" || error.cause?.code === "ENOTFOUND") {
      console.warn(
        "⚠️  Rate limiter connection failed. Continuing without rate limiting..."
      );
    } else {
      console.error("Rate limit error:", error.message);
    }
    // Continue without rate limiting if there's an error
    next();
  }
};

export default rateLimiter;
