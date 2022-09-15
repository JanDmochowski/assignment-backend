import express from 'express';
import { offers, airports } from './controllers/lufthansa';
import { Logger } from "tslog";
import cors from 'cors';

export const logger: Logger = new Logger({ name: "log: " });

const app = express();
const port = 3000;

app.use(cors({
  origin: '*'
}));

app.get('/offers/:origin/:destination', async (req, res) => {
  try {
    const result = await offers.getSchedule(req);

    res.status(200).json(result);
  } catch (e) {
    if (e instanceof Error) {
      logger.warn(e);
      res.status(500).send(e.message);
    }
  }
});

app.get('/airports', async (req, res) => {
  try {
    const result = await airports.getAirportList();

    res.status(200).json(result);
  } catch (e) {
    if (e instanceof Error) {
      logger.warn(e);
      res.status(500).send(e.message);
    }
  }
});

app.listen(port, () => {
  return logger.info(`Server is listening at http://localhost:${port}`);
});
