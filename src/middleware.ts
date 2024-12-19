import jwt from "jsonwebtoken";
import { Request, Response } from "hyper-express";
import { LRUCache } from "lru-cache";
import { getSecretKey } from "./server";

declare module "hyper-express" {
  export interface Request {
    userId?: string | jwt.JwtPayload;
  }
}

const rateLimitCache = new LRUCache<string, number[]>({
  max: 5000,
  ttl: 15 * 60 * 1000,
});

export const rateLimiter = (
  request: Request,
  response: Response,
  next: () => void
) => {
  const clientIp = request.ip;
  const currentTime = Date.now();
  const requestTimes = rateLimitCache.get(clientIp) || [];
  const recentRequests = requestTimes.filter(
    (time) => currentTime - time < 15 * 60 * 1000
  );

  if (recentRequests.length >= 100) {
    return response.status(429).json({
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
  }

  recentRequests.push(currentTime);
  rateLimitCache.set(clientIp, recentRequests);
  next();
};

export const securityHeaders = (
  request: Request,
  response: Response,
  next: () => void
) => {
  response.header("X-DNS-Prefetch-Control", "off");
  response.header("X-Frame-Options", "DENY");
  response.header(
    "Strict-Transport-Security",
    "max-age=15552000; includeSubDomains"
  );
  response.header("X-Content-Type-Options", "nosniff");
  response.header("X-XSS-Protection", "1; mode=block");
  next();
};

export const corsHeaders = (
  request: Request,
  response: Response,
  next: () => void
) => {
  response.header("Access-Control-Allow-Origin", "https://localhost");
  response.header("Access-Control-Allow-Methods", "GET, POST");
  response.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
};

export const defaultContentType = (
  request: Request,
  response: Response,
  next: () => void
) => {
  response.type("application/json");
  next();
};

export const authenticateToken = (
  request: Request,
  response: Response,
  next: () => void
) => {
  const SECRET_KEY = getSecretKey();
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return response
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return response.status(401).json({ message: "Token expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return response.status(403).json({ message: "Invalid token" });
      }
      return response.status(403).json({ message: "Token validation error" });
    }
    if (user) {
      request.userId = user;
      next();
    } else {
      return response.status(403).json({ message: "Token validation error" });
    }
    next();
  });
};
