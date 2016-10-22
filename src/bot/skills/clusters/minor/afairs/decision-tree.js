import logger from 'logger';
import Finity from 'finity';

import { SKILL_NAME as AFAIRS_SKILL_NAME } from './afairs';
import { SKILL_NAME as JUST_ASKED_AFAIRS_SKILL_NAME } from './just-asked-afairs';
import {
    SKILL_NAME as INCREASE_AFAIRS_COUNT_SKILL_NAME,
    KEY as AFAIRS_COUNT_KEY
} from './increase-afairs-count';

// Constants for State Machine
const INITIAL_STATE = 'uninitialized';
const AFAIRS_STATE = 'afairs';
const JUST_ASKED_AFAIRS_STATE = 'just asked afairs';
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
                .transitionTo(AFAIRS_STATE)
                    .withCondition(() => greetCount < 1)
                .transitionTo(JUST_ASKED_AFAIRS_STATE)
                    .withCondition(() => greetCount >= 1)

        .state(AFAIRS_STATE)
            .onEnter((state, { stateMachine }) => {
                logger.debug(`----- + ${AFAIRS_SKILL_NAME}`);
                queue.push(AFAIRS_SKILL_NAME);
                stateMachine.handle(FINAL_EVENT);
            })
            .on(FINAL_EVENT)
                .transitionTo(FINISH_STATE)

        .state(JUST_ASKED_AFAIRS_STATE)
            .onEnter((state, { stateMachine }) => {
                logger.debug(`----- + ${JUST_ASKED_AFAIRS_SKILL_NAME}`);
                queue.push(JUST_ASKED_AFAIRS_SKILL_NAME);
                stateMachine.handle(FINAL_EVENT);
            })
            .on(FINAL_EVENT)
                .transitionTo(FINISH_STATE)

        .state(FINISH_STATE)
            .onEnter(() => {
                queue.push(INCREASE_AFAIRS_COUNT_SKILL_NAME);
                logger.debug('<--', queue);
                resolve(queue);
            });
};

export default function(context) {
    logger.debug('Build decision tree');

    const { bot } = context;

    return function* () {
        // Here we get data from the Core cluster to pass it to the state machine
        const data = yield bot.memcached.get(AFAIRS_COUNT_KEY);

        // Promise should resolve an array of skills/clusters
        return new Promise(resolve => {
            const stateMachine = getStateMachine(resolve, data).start();
            stateMachine.handle(START_EVENT);
        });
    };
}
