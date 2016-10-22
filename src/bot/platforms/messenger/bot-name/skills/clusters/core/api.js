import pick from 'lodash/pick';
import logger from 'logger';
import superagent from 'superagent';
import { OK } from 'http-status';

const LOG_REQUEST_FIELDS = ['method', 'url', 'qs', 'header'];
const FACEBOOK_PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN;

export default function(id) {
    return new Promise((resolve, reject) =>
        superagent
            .get(`https://graph.facebook.com/v2.6/${id}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${FACEBOOK_PAGE_TOKEN}`)
            .use(request => {
                logger.info('Request  -->', pick(request, LOG_REQUEST_FIELDS));
                return request;
            })
            .then(
                result => {
                    if (result.status === OK) {
                        const data = JSON.parse(result.text);
                        logger.info('Response <--', data);
                        return resolve(data);
                    }

                    logger.error(result.error);
                    return reject(result.error);
                },
                error => {
                    logger.error(error);
                    return reject(error);
                }
            )
    );
}
