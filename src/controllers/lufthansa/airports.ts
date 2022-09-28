import airportsRaw from '../../models/airports.json';
import { Airport } from '../../types/types';

const airports = airportsRaw as Airport;

export function getAirportList() {
  return airports;
}
