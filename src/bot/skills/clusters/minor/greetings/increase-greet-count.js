import logger from 'logger';

export const KEY = 'greetCount';
export const SKILL_NAME = 'increaseGreetCount';

export default function* (context) {
    logger.debug(SKILL_NAME.toUpperCase());

    const { bot, rules } = context;

    if (!rules.get('silent')) {
        const greetCount = yield bot.memcached.get(KEY);

        if (!greetCount) {
            yield bot.memcached.set(KEY, 1);
        } else {
            yield bot.memcached.set(KEY, greetCount + 1);
        }
    }

    return Promise.resolve(context);
}
