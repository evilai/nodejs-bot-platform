import logger from 'logger';
import words from 'lodash/words';
import { KEY as ANNOTATED_LANGUAGE } from './google-language';

export const KEY = 'witIntentsBigrams';
export const SKILL_NAME = 'intents-bigrams';

const RESTRICTED_IN_BIGRAMS = ['ADP', 'PUNCT'];
const MIN_WORDS_COUNT = 4;

const notRestrictedToBegin = token => !~RESTRICTED_IN_BIGRAMS.indexOf(token.partOfSpeech.tag);
const getConnected = ({ tokens }, token) => tokens[token.dependencyEdge.headTokenIndex];
const notUsed = (used, index) => !~used.indexOf(index);

export default function* (session) {
    const { bot } = session;

    logger.debug(SKILL_NAME.toUpperCase());

    if (words(bot.message.text).length >= MIN_WORDS_COUNT) {
        const annotated = yield bot.memcached.get(ANNOTATED_LANGUAGE);

        const used = [];

        // Example algorithm, made in 10 minutes
        // TODO: implement something better than this
        const bigramms = annotated.tokens.reduce((acc, token, index) => {
            if (notRestrictedToBegin(token) && notUsed(used, index) && notUsed(used, token.dependencyEdge.headTokenIndex) && index !== token.dependencyEdge.headTokenIndex) {
                used.push(index, token.dependencyEdge.headTokenIndex);
                acc.push([token.lemma, getConnected(annotated, token).lemma]);
            }
            return acc;
        }, []);

        const intentsList = yield Promise.all(bigramms.map(gramm => bot.wit.send(gramm.join(' '))));
        yield bot.memcached.set(KEY, intentsList);

        logger.debug('bigrams', bigramms);
        logger.debug('intents', intentsList);
    } else {
        logger.debug(`skipped, minimum words count for bigrams is ${MIN_WORDS_COUNT}`);
    }

    return Promise.resolve(session);
}
