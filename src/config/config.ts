import * as process from 'process';

import { ConfigDto } from './dto';

export default (): ConfigDto => ({
  host: process.env.HOST || '0.0.0.0',
  port: +process.env.PORT || 8000,
  clientUrl: process.env.CLIENT_URL,
  swaggerFolder: '../storage/docs',
  logsFolder: '../logs',
});
