import rulesFactory from '../../../../src/libs/rules';

export const rules = rulesFactory({ silent: false });
export const rulesWithNonexistingSkills = rulesFactory({ silent: false, skills: ['nonExistingSkill'] });
export const rulesWithExistingSkills = rulesFactory({ silent: false, skills: ['delayedSkill'] });
