import logger from 'logger';

import { CLUSTER_NAME } from './index';
import { KEY as USER_KEY } from '../../../platforms/messenger/bot-name/clusters/core/user';

export const SKILL_NAME = 'justAskedAfairs';

export default function* (session) {
    logger.debug(SKILL_NAME.toUpperCase());

    const { bot, rules } = session;
    const { first_name } = yield bot.memcached.get(USER_KEY);

    yield bot.im(rules).send(bot.locales(`${CLUSTER_NAME}.${SKILL_NAME}`, first_name));

    return Promise.resolve(session);
}
