require('newrelic');
import express from 'express';
import bodyParser from 'body-parser';
import logger, { expressLog, expressErrorLog } from 'logger';

import healthMiddleware from './middlewares/health';
import buildRoute from './router';

// This is your bot's router
import yourBotMessengerRouter from './bot/platforms/messenger/bot-name/router-builder';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
if (!IS_PRODUCTION) {
    require('source-map-support/register');
}

const app = express();
const router = express.Router();
const server = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLog);
app.use(expressErrorLog);

// Health check endpoint, '/_ah/health' required for Google App Engine
app.use('/_ah/health', healthMiddleware);

// This route should be in the messenger webhook
buildRoute(router, '/messenger/yourbot', yourBotMessengerRouter, {});

app.use(router);

const listener = server.listen(process.env.PORT || 8080, () => {
    logger.debug(`Server started at port ${listener.address().port}`);
});
