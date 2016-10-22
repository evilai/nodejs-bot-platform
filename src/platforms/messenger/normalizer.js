import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';

import {
    ERROR_MESSENGER_NORMALIZER_DATA_CORRUPTED
} from '../../constants/errors';

/**
 * [
 *  {
 *      sender: { id: '823746283746' },
 *      recipient: { id: '98234982347' },
 *      timestamp: 1475519849260,
 *      message: {
 *          mid: 'mid.239849h238fh98',
 *          seq: 8,
 *          text: 'hi'
 *      }
 *  }
 * ]
 */

export default function(req, res, next) {
    if (isEmpty(req.body.entry) || !isArray(req.body.entry)) {
        throw new Error(ERROR_MESSENGER_NORMALIZER_DATA_CORRUPTED);
    }
    req.bot.normalized = req.body.entry.reduce((acc, entry) => {
        acc = acc.concat(entry.messaging);
        return acc;
    }, []);

    next();
}
