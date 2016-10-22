const NEW_RELIC_APP_NAME = process.env.NEW_RELIC_APP_NAME;
const NEW_RELIC_LICENSE = process.env.NEW_RELIC_LICENSE || 'debug';
const LOGGING_LEVEL = process.env.LOGGING_LEVEL;

console.log(`Newrelic started to log application: ${NEW_RELIC_APP_NAME}`);

exports.config = {
    app_name: [NEW_RELIC_APP_NAME],
    license_key: NEW_RELIC_LICENSE,
    logging: {
        level: LOGGING_LEVEL
    }
};
