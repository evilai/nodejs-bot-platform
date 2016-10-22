import { SKILL_NAME as LANGUAGE_SKILL_NAME } from './google-language';
import { SKILL_NAME as INTENTS_SKILL_NAME } from './intents';
import { SKILL_NAME as INTENTS_BIGRAMS_SKILL_NAME } from './intents-bigrams';
import { SKILL_NAME as CLEAR_SKILL_NAME } from './clear';
import { SKILL_NAME as LOCALES_SKILL_NAME } from './locales';
import { CLUSTER_NAME as HAPPY_PATH_CLUSTER_NAME } from '../happy-path';

export default function*() {
    return Promise.resolve([CLEAR_SKILL_NAME, LANGUAGE_SKILL_NAME, LOCALES_SKILL_NAME, INTENTS_SKILL_NAME, INTENTS_BIGRAMS_SKILL_NAME, HAPPY_PATH_CLUSTER_NAME]);
}
