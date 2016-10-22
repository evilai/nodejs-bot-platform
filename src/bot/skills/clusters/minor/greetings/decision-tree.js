import logger from 'logger';
import Finity from 'finity';

import { SKILL_NAME as GREET_SKILL_NAME } from './greet';
import { SKILL_NAME as JUST_GREETED_SKILL_NAME } from './just-greeted';
import { SKILL_NAME as SARCASTIC_GREET_SKILL_NAME } from './sarcastic-greet';
import {
    SKILL_NAME as INCREASE_GREET_COUNT_SKILL_NAME,
    KEY as GREET_COUNT_KEY
} from './increase-greet-count';

// Constants for State Machine
const INITIAL_STATE = 'uninitialized';
const GREET_STATE = 'greet';
const JUST_GREETED_STATE = 'just greeted';
const SARCASTIC_GREET_STATE = 'sarcastic greet';
const FINISH_STATE = 'stop building queue';

const START_EVENT = 'start';
const FINAL_EVENT = 'finish';

const getStateMachine = (resolve, greetCount = 0) => {
    const queue = [];

    return Finity
        .configure()
        .global()
            .onStateEnter(state => logger.debug(`--> ${state}`))
        .initialState(INITIAL_STATE)
            .on(START_EVENT)
                .transitionTo(GREET_STATE)
                    .withCondition(() => greetCount < 1)
                .transitionTo(JUST_GREETED_STATE)
                    .withCondition(() => greetCount >= 1 && greetCount < 3)
                .transitionTo(SARCASTIC_GREET_STATE)

        .state(GREET_STATE)
            .onEnter((state, { stateMachine }) => {
                logger.debug(`----- + ${GREET_SKILL_NAME}`);
                queue.push(GREET_SKILL_NAME);
                stateMachine.handle(FINAL_EVENT);
            })
            .on(FINAL_EVENT)
                .transitionTo(FINISH_STATE)

        .state(JUST_GREETED_STATE)
            .onEnter((state, { stateMachine }) => {
                logger.debug(`----- + ${JUST_GREETED_SKILL_NAME}`);
                queue.push(JUST_GREETED_SKILL_NAME);
                stateMachine.handle(FINAL_EVENT);
            })
            .on(FINAL_EVENT)
                .transitionTo(FINISH_STATE)

        .state(SARCASTIC_GREET_STATE)
            .onEnter((state, { stateMachine }) => {
                logger.debug(`----- + ${SARCASTIC_GREET_SKILL_NAME}`);
                queue.push(SARCASTIC_GREET_SKILL_NAME);
                stateMachine.handle(FINAL_EVENT);
            })
            .on(FINAL_EVENT)
                .transitionTo(FINISH_STATE)

        .state(FINISH_STATE)
            .onEnter(() => {
                queue.push(INCREASE_GREET_COUNT_SKILL_NAME);
                logger.debug('<--', queue);
                resolve(queue);
            });
};

export default function(context) {
    logger.debug('Build decision tree');

    const { bot } = context;

    return function* () {
        // Here we get data from the Core cluster to pass it to the state machine
        const data = yield bot.memcached.get(GREET_COUNT_KEY);

        // Promise should resolve an array of skills/clusters
        return new Promise(resolve => {
            const stateMachine = getStateMachine(resolve, data).start();
            stateMachine.handle(START_EVENT);
        });
    };
}
