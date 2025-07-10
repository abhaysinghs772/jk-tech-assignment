import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.route) {
      // Respond with 404 and ensure uniformity
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Cannot ${req.method} ${req.originalUrl}`,
        details: null, // You can include additional context if needed
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      });

      // Avoid calling next() after response
      return;
    }

    // Call next middleware if the route is found
    next();
  }
}
