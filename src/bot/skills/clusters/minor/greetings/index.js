import logger from 'logger';
import clusterCreate from 'skills-cluster';

import decisionTreeBuilder from './decision-tree';

import greetSkill, { SKILL_NAME as GREET_SKILL_NAME } from './greet';
import justGreetedSkill, { SKILL_NAME as JUST_GREETED_SKILL_NAME } from './just-greeted';
import sarcaticGreetSkill, { SKILL_NAME as SARCASTIC_GREET_SKILL_NAME } from './sarcastic-greet';
import increaseGreetCountSkill, { SKILL_NAME as INCREASE_GREET_COUNT_SKILL_NAME } from './increase-greet-count';

export const CLUSTER_NAME = 'greetings';

const cluster = clusterCreate(CLUSTER_NAME);
const skills = [
    {
        name: GREET_SKILL_NAME,
        lambda: greetSkill
    },
    {
        name: JUST_GREETED_SKILL_NAME,
        lambda: justGreetedSkill
    },
    {
        name: SARCASTIC_GREET_SKILL_NAME,
        lambda: sarcaticGreetSkill
    },
    {
        name: INCREASE_GREET_COUNT_SKILL_NAME,
        lambda: increaseGreetCountSkill
    }
];

cluster.plug(skills);

export default function* (session) {
    logger.debug(`[ ${CLUSTER_NAME.toUpperCase()} ]`);

    return cluster
        .buildDecisionTree(decisionTreeBuilder(session))
        .then(tree =>
            cluster
                .traverse(tree, session)
        );
}
