import logger from 'logger';

import getUser from './api';

export const KEY = 'user';
export const SKILL_NAME = 'user';

export default function* (session) {
    logger.debug(SKILL_NAME.toUpperCase());
    const { bot } = session;
    const existingUser = yield bot.memcached.get(KEY);

    if (!existingUser) {
        const user = yield getUser(bot.sender.id);
        yield bot.memcached.set(KEY, user);
        logger.debug(user);
    } else {
        logger.debug(existingUser);
    }

    return Promise.resolve(session);
}
