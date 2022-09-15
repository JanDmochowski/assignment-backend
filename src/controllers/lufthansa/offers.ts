import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { logger } from '../..';
import { getAirportList } from './airports';
import { flights } from '../../services';

export async function getSchedule(req: Request<{ origin: string; } & { destination: string; }, any, any, ParsedQs, Record<string, any>>) {
  const airports = await getAirportList();
  const origin = req.param('origin') as string;
  const destination = req.param('destination') as string;
  const departureDate = req.query.departureDate as string;
  const returnDate = req.query.returnDate as string;
  const service = req.query.service as string;

  let emptySearch = true;

  if (departureDate || returnDate) {
    emptySearch = false;
  }

  if (origin && !airports[origin]) {
    logger.error('Wrong origin IATA code');
    throw new Error('Wrong origin IATA code');
  }

  if (destination && !airports[destination]) {
    logger.error('Wrong destination IATA code');
    throw new Error('Wrong destination IATA code');
  }

  const result = await flights.searchFlights(emptySearch, { origin, destination, departureDate, returnDate, service });

  return result;
}
