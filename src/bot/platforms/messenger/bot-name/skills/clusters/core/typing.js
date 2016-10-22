import logger from 'logger';

export const SKILL_NAME = 'typing';

export default function* (context) {
    logger.debug(SKILL_NAME.toUpperCase());

    const { bot, rules } = context;
    yield bot.im(rules).typing();

    return Promise.resolve(context);
}
