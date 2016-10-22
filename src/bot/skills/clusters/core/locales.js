import logger from 'logger';
import { KEY as GOOGLE_LANGUAGE_KEY } from './google-language';

export const SKILL_NAME = 'locales';

export default function* (context) {
    logger.debug(SKILL_NAME.toUpperCase());

    const { bot, rules } = context;
    const { language } = yield bot.memcached.get(GOOGLE_LANGUAGE_KEY);

    if (!rules.get('getLocales')) {
        // TODO: Show the link to documentation
        return Promise.reject('No cpecified getLocales in rules.');
    }

    bot.locales = rules.get('getLocales')(language);

    logger.debug('Language setted to', language);

    return Promise.resolve(context);
}
