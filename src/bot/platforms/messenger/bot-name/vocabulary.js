/**
 * This is a vocabulary for paticular bot.
 * I've decided to keep all vocabulary in one place,
 * but it you have a deployable skill cluster,
 * then you need to separate this file and use
 * vocabulary partials.
 *
 * How is better to structure vocabulary:
 * {
 *      language1: {
 *          clusterName: {
 *              skillName: {
 *                  key: [
 *                      'Text 1',
 *                      'Text 2'
 *                  ]
 *              }
 *          }
 *      },
 *
 *      language2: {
 *          ...
 *      }
 * }
 *
 * Or if you have mood in the bot:
 * {
 *      language1: {
 *          clusterName: {
 *              skillName: {
 *                  key: {
 *                      mood1: [
 *                         'Text 1',
 *                         'Text 2'
 *                         ],
 *                      mood2: [
 *                         'Text 1',
 *                         'Text 2'
 *                         ],
 *                  },
 *                  key2: (data) => [
 *                      `Text ${data.smth} 1`,
 *                      `Text ${data.smth} 1`
 *                  ]
 *              }
 *          }
 *      },
 *
 *      language2: {
 *          ...
 *      }
 * }
 */

export default {
    en: {
        greetings: {

            // Don't have any other answers, so don't need key level
            greet: (userName) => [
                `Hi ${userName}.`,
                `${userName}. It's been a while.`,
                `Hello.`
            ],

            justGreeted: (userName) => [
                `We just greeted.`,
                `We just greeted ${userName}.`,
                `Ok. Hi. Again.`,
                `We just greeted. I hope it was you, ${userName}.`
            ],

            sarcaticGreet: (userName) => [
                `I'll order vitamins for memory. ;) Hi.`,
                `I can swear that we greeted several times already.`,
                `Are we playing a game or something?`,
                `${userName}, sometimes I have same problems. Just can't remember what I did before. We greeted several times already. I swear.`,
                `I have an idea! Let's stop greeting each other? :P`
            ]
        },

        afairs: {
            afairs: (userName) => [
                `Fine ${userName}, thanks!`,
                `I'm fine, thanks!`,
                `It's ok.`
            ],
            justAskedAfairs: (userName) => [
                `Could be better`,
                `It was OK before you asked. Several times.`,
                `I've talked to hundreds people today, how do you think?`
            ]
        }
    }
};
