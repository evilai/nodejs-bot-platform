import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';

// TODO: Add documentation
export function extractIntents(intentsToExtract, intentsList) {
    return reduce(intentsToExtract, (acc, minConfidence, intentName) => {
        const intent = intentsList[intentName];

        if (!isEmpty(intent)) {
            intent.forEach(({ confidence, value }) => {
                if (minConfidence <= confidence) {
                    acc.push(value);
                }
            });
        }

        return acc;
    }, []);
}

export function extractIntentsBigrams(intentsToExtract, intentsBigrams = []) {
    return intentsBigrams.reduce((acc, intentsList) => {
        acc = acc.concat(extractIntents(intentsToExtract, intentsList));
        return acc;
    }, []);
}
