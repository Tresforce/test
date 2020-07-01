// TODO uncomment logdna when ready for dev and prod log collection
import path from 'path';
import winston from 'winston';
// import LogdnaWinston from 'logdna-winston';

/** Since our config imports Logger we cannot load environment variables from our config file and must import them directly */
const NODE_ENV =
  typeof process.env.NODE_ENV !== 'undefined'
    ? process.env.NODE_ENV
    : 'development';
const SILENT_LOGGING = NODE_ENV === 'test';
const logLevel =
  typeof process.env.LOG_LEVEL !== 'undefined' ? process.env.LOG_LEVEL : 'info';

// const options = {
//   key: process.env.LOGDNA_API_KEY,
//   // hostname: myHostname,
//   app: 'MVP',
//   env: NODE_ENV,
//   level: 'info', // Default to debug, maximum level of log, doc: https://github.com/winstonjs/winston#logging-levels
//   index_meta: true, // Defaults to false, when true ensures meta object will be searchable,
//   handleExceptions: true
// };

/**
 * gets the path of the logging statement
 *
 * @param {module} callingModule node module calling the logger
 * @returns {string} path of the logging statement
 */
function getLabel(callingModule: NodeModule): string {
  const parts = callingModule.filename.split(path.sep);
  const namedPath = path.join(...parts.slice(parts.indexOf('src') + 1));
  return namedPath;
}

export default (callingModule: NodeModule): winston.Logger => {
  const transports = [];
  if (!['development', 'testing'].includes(NODE_ENV)) {
    transports.push(new winston.transports.Console());
  } else {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.label({ label: getLabel(callingModule) }),
          winston.format.simple(),
          winston.format.colorize({ all: true }),
          winston.format.splat(),
          winston.format.printf(
            info =>
              `[${info.timestamp}] [${info.label}] [${info.level}]: ${
                info.message
              } ${typeof info.stack !== 'undefined' ? info.stack : ''}`
          )
        )
      })
    );
  }
  const logger = winston.createLogger({
    level: logLevel,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    silent: SILENT_LOGGING,
    transports
  });
  // logger.add(new LogdnaWinston(options));
  return logger;
};
