import { Request, Response } from "hyper-express";

// Define the type for the global request times
declare global {
  var requestTimes: {
    [key: string]: number[];
  };
}

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

export const rateLimiter = (
  request: Request,
  response: Response,
  next: () => void
) => {
  const clientIp = request.ip;
  const currentTime = Date.now();
  if (!global.requestTimes) {
    global.requestTimes = {};
  }
  if (!global.requestTimes[clientIp]) {
    global.requestTimes[clientIp] = [];
  }
  const requestTimesForIp = global.requestTimes[clientIp].filter(
    time => currentTime - time < 15 * 60 * 1000
  );
  if (requestTimesForIp.length >= 100) {
    return response.status(429).json({
      message: "Too many requests from this IP, please try again after 15 minutes"
    });
  }
  requestTimesForIp.push(currentTime);
  global.requestTimes[clientIp] = requestTimesForIp;

  next();
};
