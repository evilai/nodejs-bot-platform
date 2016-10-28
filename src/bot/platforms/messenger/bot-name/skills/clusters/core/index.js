import logger from 'logger';
import clusterCreate from 'skills-cluster';

import seenSkill, { SKILL_NAME as SEEN_SKILL_NAME } from './seen';
import typingSkill, { SKILL_NAME as TYPING_SKILL_NAME } from './typing';
import userSkill, { SKILL_NAME as USER_SKILL_NAME } from './user';
import coreCluster, { CLUSTER_NAME as CORE_CLUSTER_NAME } from '../../../../../../skills/clusters/core';

// Don't forget to export name, you should use it in decision tree builders
export const CLUSTER_NAME = 'messengerCore';

const cluster = clusterCreate(CLUSTER_NAME);
const skills = [
    {
        name: SEEN_SKILL_NAME,
        lambda: seenSkill
    },
    {
        name: TYPING_SKILL_NAME,
        lambda: typingSkill
    },
    {
        name: USER_SKILL_NAME,
        lambda: userSkill
    },
    {
        name: CORE_CLUSTER_NAME,
        lambda: coreCluster
    }
];

cluster.plug(skills);

export default function* (session) {
    logger.debug(`[ ${CLUSTER_NAME.toUpperCase()} ]`);

    // Here we know exactly the order of skills, so we don't need to build decision tree.
    return cluster.traverse([SEEN_SKILL_NAME, TYPING_SKILL_NAME, USER_SKILL_NAME, CORE_CLUSTER_NAME], session);
}
