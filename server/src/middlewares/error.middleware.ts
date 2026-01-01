import { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(error)

  if (res.headersSent) {
    return next(error)
  }

  res.sendStatus(500)
}
