import 'express';

// **** Declaration Merging **** //

declare module 'express' {

  export interface Request {
    signedCookies: Record<string, string>;
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}
