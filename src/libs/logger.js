import config from 'config';
import createLogger, { createExpressLog, createExpressErrorLog } from 'nbp-logger';

const LOGGING_LEVEL = process.env.LOGGING_LEVEL || 'debug';
const colorize = !config.isProduction;

export default createLogger({ level: LOGGING_LEVEL, colorize });
export const expressLog = createExpressLog({ colorize });
export const expressErrorLog = createExpressErrorLog({ colorize });
