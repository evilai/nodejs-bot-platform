import logger from 'logger';
import clusterCreate from 'skills-cluster';

import decisionTreeBuilder from './decision-tree';

import afairsSkill, { SKILL_NAME as AFAIRS_SKILL_NAME } from './afairs';
import justAskedAfairsSkill, { SKILL_NAME as JUST_ASKED_AFAIRS_SKILL_NAME } from './just-asked-afairs';
import increaseAfairsCountSkill, { SKILL_NAME as INCREASE_AFAIRS_COUNT_SKILL_NAME } from './increase-afairs-count';

export const CLUSTER_NAME = 'afairs';

const cluster = clusterCreate(CLUSTER_NAME);
const skills = [
    {
        name: AFAIRS_SKILL_NAME,
        lambda: afairsSkill
    },
    {
        name: JUST_ASKED_AFAIRS_SKILL_NAME,
        lambda: justAskedAfairsSkill
    },
    {
        name: INCREASE_AFAIRS_COUNT_SKILL_NAME,
        lambda: increaseAfairsCountSkill
    }
];

cluster.plug(skills);

export default function* (context) {
    logger.debug(`[ ${CLUSTER_NAME.toUpperCase()} ]`);

    return cluster
        .buildDecisionTree(decisionTreeBuilder(context))
        .then(tree =>
            cluster
                .traverse(tree, context)
        );
}
