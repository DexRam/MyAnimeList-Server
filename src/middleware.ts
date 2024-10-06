import { Request, Response } from 'hyper-express';

export const securityHeaders = (request: Request, response: Response, next: () => void) => {
    response.header('X-DNS-Prefetch-Control', 'off');
    response.header('X-Frame-Options', 'DENY');
    response.header('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
    response.header('X-Content-Type-Options', 'nosniff');
    response.header('X-XSS-Protection', '1; mode=block');
    next();
};

export const corsHeaders = (request: Request, response: Response, next: () => void) => {
    response.header('Access-Control-Allow-Origin', 'https://localhost');
    response.header('Access-Control-Allow-Methods', 'GET, POST');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

export const defaultContentType = (request: Request, response: Response, next: () => void) => {
    response.type('application/json');
    next();
};
