import logger from 'logger';

import { KEY as LANGUAGE_KEY } from './google-language';
import { KEY as INTENTS_KEY } from './intents';
import { KEY as INTENTS_BIGRAMS_KEY } from './intents-bigrams';

export const SKILL_NAME = 'clear';

const SKILLS_TO_CLEAR = [
    LANGUAGE_KEY,
    INTENTS_KEY,
    INTENTS_BIGRAMS_KEY
];

export default function* (session) {
    const { bot, rules } = session;

    logger.debug(SKILL_NAME.toUpperCase());
    yield Promise.all(SKILLS_TO_CLEAR.map(skillName => bot.memcached.del(skillName)));

    logger.debug('cleared', SKILLS_TO_CLEAR);

    return Promise.resolve(session);
}
