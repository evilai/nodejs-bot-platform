import logger from 'logger';

export const SKILL_NAME = 'seen';

export default function* (context) {
    logger.debug(SKILL_NAME.toUpperCase());

    const { bot, rules } = context;

    yield bot.im(rules).seen();

    return Promise.resolve(context);
}
