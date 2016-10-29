import logger from 'logger';

export const SKILL_NAME = 'googleLanguage';
export const KEY = 'languageAnnotated';

export default function* (session) {
    const { bot } = session;
    logger.debug(SKILL_NAME.toUpperCase());

    const annotated = yield bot.googleLanguage.annotate(bot.message.text, {
        verbose: true,
        features: {
            extractSyntax: true,
            extractEntities: true,
            extractDocumentSentiment: true
        }
    });

    yield bot.memcached.set(KEY, annotated);

    logger.debug('Annotated', annotated);

    return Promise.resolve(session);
}
