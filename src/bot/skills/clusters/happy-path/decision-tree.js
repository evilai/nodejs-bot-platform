import logger from 'logger';
import Finity from 'finity';
import pick from 'lodash/pick';
import union from 'lodash/union';

import { extractIntents, extractIntentsBigrams } from 'libs/intent-extractor';

import { KEY as INTENTS_KEY } from '../core/intents';
import { KEY as INTENTS_BIGRAMS_KEY } from '../core/intents-bigrams';

// Constants for State Machine
const INITIAL_STATE = 'uninitialized';
const CHECK_MINOR_INTENTS_STATE = 'check minor intents';
const FINISH_STATE = 'stop building queue';

const START_EVENT = 'start';
const FINAL_EVENT = 'finish';

// Constants for Intents classification
const MINOR_INTENTS = ['greetings', 'afairs'];
const INTENTS_MIN_CONFIDENCE = {
    greetings: 0.8
};

/**
 *
 * Here is the main logic for building decision tree for the whole bot.
 * Main trick is that we don't add paticular skills to the queue, we should add cluster names.
 * And inside those clusters we will have same decision tree builders to build part of tree.
 *
 * resolve – is a promise function. When you do resolve([Array]), skill cluster will start
 * skills/clusters traversal, that means that you shouldn't change state after you resolve.
 */
const getStateMachine = (resolve, { witIntents, witIntentsBigrams }) => {
    let queue = [];

    return Finity
        .configure()
        .global()
            .onStateEnter((state) => logger.debug(`--> ${state}`))
        .initialState(INITIAL_STATE)
            .on(START_EVENT)
                .transitionTo(CHECK_MINOR_INTENTS_STATE)

        .state(CHECK_MINOR_INTENTS_STATE)
            .onEnter((state, { stateMachine }) => {
                const intentsToExtract = pick(INTENTS_MIN_CONFIDENCE, MINOR_INTENTS);
                const approvedMinorIntents = extractIntents(intentsToExtract, witIntents);
                const approvedMinorIntentsBigrams = extractIntentsBigrams(intentsToExtract, witIntentsBigrams);

                const clustersToAdd = union(approvedMinorIntents, approvedMinorIntentsBigrams);
                logger.debug(`----- + ${clustersToAdd}`);

                queue = queue.concat(clustersToAdd);

                stateMachine.handle(FINAL_EVENT);
            })
            .on(FINAL_EVENT)
                .transitionTo(FINISH_STATE)

        .state(FINISH_STATE)
            .onEnter(() => {
                logger.debug(`<--`, queue);
                resolve(queue);
            });
};

export default function({ bot, rules }) {
    logger.debug('Build decision tree');

    return function*() {
        // Here we get data from the Core cluster to pass it to the state machine
        const data = yield bot.memcached.getMulti([INTENTS_KEY, INTENTS_BIGRAMS_KEY]);

        // Promise should resolve an array of skills/clusters
        return new Promise((resolve) => {
            const stateMachine = getStateMachine(resolve, data).start();
            stateMachine.handle(START_EVENT);
        });
    };
}
