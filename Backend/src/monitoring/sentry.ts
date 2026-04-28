import * as Sentry from '@sentry/node';
import { Express } from 'express';

export function initSentry(app: Express) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.APP_ENV || 'development',
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  app.use(Sentry.Handlers.errorHandler());
}
