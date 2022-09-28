import { Router } from 'express';
import { airports } from '../controllers/lufthansa';
import { Logger } from "tslog";
import StatusCodes from 'http-status-codes';

const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

export const logger: Logger = new Logger({ name: "log: " });

// **** Init **** //

const airportRouter = Router();

airportRouter.get('/', (req, res) => {
  try {
    const result = airports.getAirportList();

    res.status(OK).json(result);
  } catch (e) {
    if (e instanceof Error) {
      logger.warn(e);
      res.status(INTERNAL_SERVER_ERROR).send(e.message);
    }
  }
});

export default airportRouter;
