import { Request, Response, NextFunction } from 'express';


// Error handler to display the error as HTML
// @ts-ignore
export default function errorHandler(err: Error,  req: Request, res: Response, next?: NextFunction) { // tslint:disable:no-unused-variable
  res.status((err as any).status || 500);
  res.send(
    `<h1>${(err as any).status || 500} Error</h1>` +
    `<pre>${err.message}</pre>`);
}

