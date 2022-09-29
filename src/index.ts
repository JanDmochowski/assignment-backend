import './pre-start'; // Must be the first import

import envVars from '@shared/env-vars';
import server from './server';

import { Logger } from "tslog";
export const logger: Logger = new Logger({ name: "log: " });

// Constants
const serverStartMsg = 'Express server started on port: ';

// Start server
server.listen(envVars.port, () => {
  logger.info(serverStartMsg + envVars.port.toString());
});
