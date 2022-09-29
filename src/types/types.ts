export interface Flight {
  origin: string,
  destination: string,
  departureDate: string,
  seatAvailability: number,
  price: {
    amount: number,
    currency: string
  },
  offerType: string,
}

export interface Airport {
  [key: string]: {
    name: string,
    city: string,
    country: string,
    iata: string,
    icao: string,
    latitude: string,
    longitude: string
    altitude: string,
    timezone: string,
    dst: string,
  },
}

export interface SearchFlightsOptions {
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string,
  service: string,
}
