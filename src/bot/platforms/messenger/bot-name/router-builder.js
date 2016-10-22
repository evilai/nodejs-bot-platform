import co from 'co';
import { resolve } from 'path';
import logger from 'logger';
import createFBMessengerClient from 'nbp-adapter-fb-messenger';
import createWitClient from 'nbp-adapter-wit';
import createMemcachedClient from 'nbp-adapter-memcached';
import createGoogleNaturalLanguageClient from 'nbp-adapter-google-natural-language';
import createGoogleDatastoreClient from 'nbp-adapter-google-datastore';
import locales from 'nbp-locales';
import createRules from 'nbp-rules';

import initializer from '../../../../platforms/messenger/initializer';
import normalizer from '../../../../platforms/messenger/normalizer';

import messenger from '../../../../tunnel/instant-messengers/messenger';
import gstorage from '../../../../tunnel/storages/google-storage';
import memcached from '../../../../tunnel/storages/memcached';
import wit from '../../../../tunnel/artificial-intellegence/wit';
import googleLanguage from '../../../../tunnel/artificial-intellegence/google/language';

import skillsCluster from './skills/clusters/core';
import vocabulary from './vocabulary';

const PLATFORM = 'your-platform';

const FB_MESSENGER_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_TOKEN;
const APP_WIT_TOKEN = process.env.APP_WIT_TOKEN;
const APP_WIT_VERSION = process.env.APP_WIT_VERSION;
const MEMCACHED_ADDRESS = process.env.MEMCACHE_PORT_11211_TCP_ADDR;
const MEMCACHED_PORT = process.env.MEMCACHE_PORT_11211_TCP_PORT;
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const GOOGLE_PROJECT_KEYS_FILENAME = process.env.GOOGLE_PROJECT_KEYS || resolve(__dirname, '../../../../../keys/google.json');

// This context will be passed to all skills
const initContext = bot => ({
    bot,
    rules: createRules({

        // Decide if we should be silent (should we talk to user or no)
        silent: false,

        // Method used to specify vocabulary for the current bot
        getLocales: locales(vocabulary)
    })
});

export default function(router, route) {

    // POST used to recieve requests from IM
    router.post(route, [
        initializer(PLATFORM),
        normalizer,
        gstorage(createGoogleDatastoreClient({
            platform: PLATFORM,
            projectId: GOOGLE_PROJECT_ID,
            keyFilename: GOOGLE_PROJECT_KEYS_FILENAME,
            logger
        })),
        memcached(createMemcachedClient({
            platform: PLATFORM,
            address: MEMCACHED_ADDRESS,
            port: MEMCACHED_PORT,
            logger
        })),
        wit(createWitClient({
            token: APP_WIT_TOKEN,
            version: APP_WIT_VERSION,
            logger
        })),
        googleLanguage(createGoogleNaturalLanguageClient({
            projectId: GOOGLE_PROJECT_ID,
            keyFilename: GOOGLE_PROJECT_KEYS_FILENAME,
            logger
        })),
        messenger(createFBMessengerClient({
            accessToken: FB_MESSENGER_ACCESS_TOKEN,
            logger
        })),

        (req, res) => {

            // Say to messenger, that we've got it's request
            res.status(200).send('ok');

            req.bot.normalized.forEach(bot => co(skillsCluster(initContext(bot))));
        }
    ]);

    // GET used to setup Facebook Messenger webhooks
    router.get(route, (req, res) => {
        res.send(req.query['hub.challenge']);
    });
}
