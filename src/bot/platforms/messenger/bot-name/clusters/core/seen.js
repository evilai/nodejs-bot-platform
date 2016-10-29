import logger from 'logger';

export const SKILL_NAME = 'seen';

export default function* (session) {
    logger.debug(SKILL_NAME.toUpperCase());

    const { bot, rules } = session;

    yield bot.im(rules).seen();

    return Promise.resolve(session);
}
