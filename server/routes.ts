import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router'
import authRouter from './api/controllers/auth/router';
import contentRouter from './api/controllers/content/router';
export default function routes(app: Application): void {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/content', contentRouter)
};