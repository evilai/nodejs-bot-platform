import logger from 'logger';
import clusterCreate from 'skills-cluster';
import decisionTreeBuilder from './decision-tree';

import clearSkill, { SKILL_NAME as CLEAR_SKILL_NAME } from './clear';
import languageSkill, { SKILL_NAME as LANGUAGE_SKILL_NAME } from './google-language';
import intentsSkill, { SKILL_NAME as INTENTS_SKILL_NAME } from './intents';
import localesSkill, { SKILL_NAME as LOCALES_SKILL_NAME } from './locales';
import intentsBigramsSkill, { SKILL_NAME as INTENTS_BIGRAMS_SKILL_NAME } from './intents-bigrams';
import happyPath, { CLUSTER_NAME as HAPPY_PATH_CLUSTER_NAME } from '../happy-path';

export const CLUSTER_NAME = 'CORE';

const cluster = clusterCreate(CLUSTER_NAME);
const skills = [
    {
        name: CLEAR_SKILL_NAME,
        lambda: clearSkill
    },
    {
        name: LANGUAGE_SKILL_NAME,
        lambda: languageSkill
    },
    {
        name: INTENTS_SKILL_NAME,
        lambda: intentsSkill
    },
    {
        name: INTENTS_BIGRAMS_SKILL_NAME,
        lambda: intentsBigramsSkill
    },
    {
        name: HAPPY_PATH_CLUSTER_NAME,
        lambda: happyPath
    },
    {
        name: LOCALES_SKILL_NAME,
        lambda: localesSkill
    }
];

cluster.plug(skills);

export default function(session) {
    logger.debug(`[ ${CLUSTER_NAME.toUpperCase()} ]`);

    return cluster
        .buildDecisionTree(decisionTreeBuilder)
        .then(tree =>
            cluster
                .traverse(tree, session)
        );
}
