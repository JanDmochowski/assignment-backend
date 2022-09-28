import { Router } from 'express';
import { offers } from '../controllers/lufthansa';
import { Logger } from "tslog";
import StatusCodes from 'http-status-codes';

const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

export const logger: Logger = new Logger({ name: "log: " });

// **** Init **** //

const offerRouter = Router();

offerRouter.get('/:origin/:destination', async (req, res) => {
  try {
    const result = await offers.getSchedule(req);

    res.status(OK).json(result);
  } catch (e) {
    if (e instanceof Error) {
      logger.warn(e);
      res.status(INTERNAL_SERVER_ERROR).send(e.message);
    }
  }
});

export default offerRouter;
