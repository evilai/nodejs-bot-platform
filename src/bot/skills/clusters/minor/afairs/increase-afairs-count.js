import logger from 'logger';

export const KEY = 'afairsCount';
export const SKILL_NAME = 'increaseAfairsCount';

export default function* (context) {
    logger.debug(SKILL_NAME.toUpperCase());

    const { bot, rules } = context;

    if (!rules.get('silent')) {
        const afairsCount = yield bot.memcached.get(KEY);

        if (!afairsCount) {
            yield bot.memcached.set(KEY, 1);
        } else {
            yield bot.memcached.set(KEY, afairsCount + 1);
        }
    }

    return Promise.resolve(context);
}
