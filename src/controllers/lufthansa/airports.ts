import airportsRaw from '../../models/airports.json';
import { Airport } from '../../modules/types';

const airports = airportsRaw as Airport;

export async function getAirportList() {
  return airports;
}
