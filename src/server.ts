import StatusCodes from 'http-status-codes';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import 'express-async-errors';

import offerRouter from './routes/offers';
import airportRouter from './routes/airports';
import logger from 'jet-logger';
import { CustomError } from '@shared/errors';


// **** Init express **** //

const app = express();

app.use(cors({
  origin: '*',
}));

// **** Set basic express settings **** //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// **** Add API routes **** //

// Add APIs
app.use('/offers', offerRouter);
app.use('/airports', airportRouter);

// Setup error handler
app.use((
  err: Error | CustomError,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  logger.err(err, true);
  // Status
  const status = (
    err instanceof CustomError
      ? err.HttpStatus
      : StatusCodes.BAD_REQUEST
  );
  // Return
  return res.status(status).json({
    error: err.message,
  });
});


// **** Export default **** //

export default app;
