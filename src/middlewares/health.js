import { OK } from 'http-status';

export default function(req, res, next) {
    res.sendStatus(OK);
}
