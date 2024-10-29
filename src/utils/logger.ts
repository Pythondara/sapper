import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as dayjs from 'dayjs';
import * as process from 'process';

export default function (dirname?: string) {
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  let logLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
  if (
    ['error', 'warn', 'info', 'http', 'verbose', 'debug'].indexOf(logLevel) < 0
  ) {
    logLevel = 'info';
  }

  return WinstonModule.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
      }),
      winston.format.ms(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          winston.format.printf(
            ({ level, message, context, timestamp, ms, tid, data }) => {
              let msg = `${timestamp} ${ms} ${level} [${context}]${
                tid ? `[${tid}]` : ''
              } ${message}`;
              if (data) {
                msg += ' ' + JSON.stringify(data, getCircularReplacer());
              }
              return msg;
            },
          ),
        ),
      }),
      new winston.transports.File({
        filename: dayjs().format('YYYY-MM-DD') + '.log',
        dirname,
        handleExceptions: true,
      }),
    ],
  });
}
