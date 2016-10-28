import logger from 'logger';

export const SKILL_NAME = 'typing';

export default function* (session) {
    logger.debug(SKILL_NAME.toUpperCase());

    const { bot, rules } = session;
    yield bot.im(rules).typing();

    return Promise.resolve(session);
}
