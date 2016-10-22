import logger from 'logger';
import clusterCreate from 'skills-cluster';
import decisionTreeBuilder from './decision-tree';

import greetingsCluster, { CLUSTER_NAME as GREETINGS_CLUSTER_NAME } from '../minor/greetings';
import afairsCluster, { CLUSTER_NAME as AFAIRS_CLUSTER_NAME } from '../minor/afairs';

export const CLUSTER_NAME = 'happyPath';

const cluster = clusterCreate(CLUSTER_NAME);
const skills = [
    {
        name: GREETINGS_CLUSTER_NAME,
        lambda: greetingsCluster
    },
    {
        name: AFAIRS_CLUSTER_NAME,
        lambda: afairsCluster
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
