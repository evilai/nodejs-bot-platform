import logger from 'logger';

export const SKILL_NAME = 'afairs';

export default function* (context) {
    logger.debug(SKILL_NAME.toUpperCase());

    return Promise.resolve(context);
}
