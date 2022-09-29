import flightsRaw from '../models/flights.json';
import { Flight, SearchFlightsOptions } from '../types/types';
import moment from 'moment';
import * as uuid from 'uuid';
import { getAirportList } from '../controllers/lufthansa/airports';

const flights = flightsRaw as Flight[];

export function searchFlights(emptySearch: boolean, options: SearchFlightsOptions) {
  const airports = getAirportList();
  const { origin, destination, departureDate, returnDate, service } = options;

  const resultUnoptimized = flights.filter((flight: Flight) => {
    if (
      (flight.origin !== airports[origin]?.name && flight.destination !== airports[origin]?.name)
      ||
      (
        flight.origin !== airports[destination]?.name
        &&
        flight.destination !== airports[destination]?.name
      )
    ) {
      return false;
    }

    return !moment(flight.departureDate).isBefore(moment());
  });

  let result: any = [];

  if (!emptySearch) {
    if (service === 'amadeusBestPrice' && departureDate && returnDate) {
      const travelDuration = moment(returnDate).diff(moment(departureDate), 'days');
      const departures = resultUnoptimized
        .filter((flight) => flight.origin === airports[origin].name);
      const arrivals = resultUnoptimized
        .filter((flight) => flight.origin === airports[destination].name);

      departures.forEach((flight) => {
        arrivals.forEach((el) => {
          if (moment(el.departureDate)
            .isSame(
              moment(flight.departureDate).add(travelDuration, 'days'),
            ) &&
            flight.seatAvailability > 0 &&
            el.seatAvailability > 0 &&
            (!result[0] || result[0]?.price?.amount > flight.price.amount + el.price.amount)
          ) {
            if (result.length) {
              result[0] = {
                ...flight,
                returnDate: moment(flight.departureDate)
                  .add(travelDuration, 'days')
                  .format('YYYY-MM-DD'),
                price: {
                  currency: flight.price.currency,
                  amount: flight.price.amount + el.price.amount,
                },
                offerType: 'amadeusBestPrice',
                uuid: uuid.v1(),
                seatAvailability: flight.seatAvailability < el.seatAvailability ?
                  flight.seatAvailability :
                  el.seatAvailability,
              };
            } else {
              result.push(
                {
                  ...flight,
                  returnDate: moment(flight.departureDate)
                    .add(travelDuration, 'days')
                    .format('YYYY-MM-DD'),
                  price: {
                    currency: flight.price.currency,
                    amount: flight.price.amount + el.price.amount,
                  },
                  offerType: 'amadeusBestPrice',
                  uuid: uuid.v1(),
                  seatAvailability: flight.seatAvailability < el.seatAvailability ?
                    flight.seatAvailability :
                    el.seatAvailability,
                },
              );
            }
          }
        });
      });
    } else {
      const departures = resultUnoptimized.filter(
        (flight) => flight.origin === airports[origin].name,
      );

      const arrivals = resultUnoptimized.filter(
        (flight) => flight.origin === airports[destination].name,
      );

      departures.forEach((flight) => {
        arrivals.forEach((el) => {
          if (moment(flight.departureDate).isSame(moment(departureDate)) &&
            moment(el.departureDate).isSame(moment(returnDate)) &&
            flight.seatAvailability > 0 &&
            el.seatAvailability > 0 &&
            (!result[0] || result[0]?.price?.amount > flight.price.amount + el.price.amount)
          ) {
            if (result.length) {
              result[0] = {
                ...flight,
                returnDate: moment(el.departureDate).format('YYYY-MM-DD'),
                price: {
                  currency: flight.price.currency,
                  amount: flight.price.amount + el.price.amount,
                },
                offerType: 'ExactMatch',
                uuid: uuid.v1(),
                seatAvailability: flight.seatAvailability < el.seatAvailability ?
                  flight.seatAvailability :
                  el.seatAvailability,
              };
            } else {
              result.push(
                {
                  ...flight,
                  returnDate: moment(el.departureDate).format('YYYY-MM-DD'),
                  price: {
                    currency: flight.price.currency,
                    amount: flight.price.amount + el.price.amount,
                  },
                  offerType: 'ExactMatch',
                  uuid: uuid.v1(),
                  seatAvailability: flight.seatAvailability < el.seatAvailability ?
                    flight.seatAvailability :
                    el.seatAvailability,
                },
              );
            }
          }
        });
      });
    }
  } else {
    result = resultUnoptimized.filter((flight) => flight.origin === airports[origin].name);
  }

  return result;
}
