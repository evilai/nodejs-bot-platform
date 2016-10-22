import Cluster from 'nbp-skills-cluster';
import logger from 'logger';
import newrelic from 'newrelic';

export default function(name, params = {}) {
    return new Cluster(name, Object.assign({}, params, {
        errorHandler: (error) => {
            logger.error(error);
            newrelic.noticeError(error);
        }
    }));
}
