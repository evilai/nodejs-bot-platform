# Node.js Bot Platform

This is a Node.js platform for bots (boilerplate and start point). Implemented on top of Express, which is used only for routing, so it's easily can be changed. Platform in this case is a boilerplate, set of tools, architecture and best practices for bot building.

What's implemented.
 * [Cluster of Skills](https://github.com/evilai/nbp-skills-cluster) (allows to build part of global decision tree, where each leaf is a Skill, and run tree traversal).
   * Skills (pure functions, generators or async functions)
 * Storage
   * [Google Cloud Datastore adapter](https://github.com/evilai/nbp-adapter-google-datastore)
   * [Memcached adapter](https://github.com/evilai/nbp-adapter-memcached)
 * Instant Messengers
   * [Facebook Messenger adapter](https://github.com/evilai/nbp-adapter-fb-messenger)
 * Natural Language Processing
   * [Wit.ai adapter](https://github.com/evilai/nbp-adapter-wit)
   * [Google Natural Language adapter](https://github.com/evilai/nbp-adapter-google-natural-language)
 * Monitoring
   * Newrelic

## Keys (important)
#### Google Cloud
Be sure that you replaced keys in **/keys/** folder. To download json with keys:
   1. Go to [Google Console API manager](https://console.cloud.google.com/apis/dashboard) and check **credentials**.
   2. Click on the button _Create credentials_ -> _Service Account Key_ -> _JSON_.
   3. Download generated file, rename it to **google.json** and replace `/keys/google.json`.
   4. Don't forget to enable APIs (if you use it, of course):
        * Datastore
        * Natural Language

#### Other keys
Please, replace `app.yaml` and `app-dev.yaml` files and provide listed keys. If you use different environments (live/staging/dev), don't forget to specify different keys. Right now there are only two environments: _development_ and _production_.

Example of `app.yaml` file:
```
runtime: custom
vm: true

env_variables:
  LOGGING_LEVEL: 'debug'
  APP_WIT_TOKEN: 'yourkeyhere'
  APP_WIT_VERSION: '20161008'
  GOOGLE_PROJECT_ID: 'youridhere'
  FACEBOOK_PAGE_TOKEN: 'yourtokenhere'
  NEW_RELIC_APP_NAME: 'youappname'
  NEW_RELIC_LICENSE: 'yourkey'
```
* LOGGING_LEVEL – check [Winston logging levels](https://github.com/winstonjs/winston#logging-levels)
* APP_WIT_TOKEN – you can get it in your wit.ai application settings (https://wit.ai/[your-login]/[your-app]/settings)
* APP_WIT_VERSION – this is _v_ param in curl example on the application settings page (https://wit.ai/[your-login]/[your-app]/settings)
* GOOGLE_PROJECT_ID – you can get it on the dashboard page of your Google project in Google console
* FACEBOOK_PAGE_TOKEN – token of your facebook page

Example of the `app-dev.yaml` file:
```
runtime: custom
vm: true

env_variables:
  LOGGING_LEVEL: 'silly'
  APP_WIT_TOKEN: 'yourkeyhere'
  APP_WIT_VERSION: '20161008'
  MEMCACHE_PORT_11211_TCP_ADDR: 'localhost'
  MEMCACHE_PORT_11211_TCP_PORT: '11211'
  GOOGLE_PROJECT_ID: 'youridhere'
  FACEBOOK_PAGE_TOKEN: 'yourtokenhere'
  NEW_RELIC_APP_NAME: 'youappname'
  NEW_RELIC_LICENSE: 'yourkey' 
```
It's almost the same, but **logging level** is different and you need to provide **memcached** host and port. In case of `app.yaml` (for production) it will be provided by Google App Engine automatically.

## Build
For building I use webpack. Please, notice that I have **aliases** for common libraries and files, that I use:
* skill-cluster (pretty self explanatory, will discuss later)
* config (please, keep only global configuration for the whole platform)
* locales (library for supporting different locales)
* logger (based on [Winston](https://github.com/winstonjs/winston))
* rules

You can find configuration at `/build/index.js`.

#### How to build
* ``npm run build:dev`` - build for development.
* ``npm run build:dev:watch`` – build for development in watch mode.

## Start
#### Package.json scripts
* ``npm run start`` – run production environment with keys from `app.yaml`.
* ``npm run start:dev`` – run development environment with keys from `app-dev.yaml`.

#### Shell scripts
All shell scripts are used by _package.json_ scripts, so you don't need to run it explicitly.
* _/tools/start/prod.sh_ – read variables from _app.yaml_ and starting builded bot in _/dist/bot.js_.
* _/tools/start/dev.sh_ – read variables from _app-dev.yaml_ and starting builded bot in _/dist/bot.js_.

## Deployment
Node.js Bot Platform right now is easily deployable to Google App Engine.

## Architecture
Please, check code and folders. I'll try to add README in all folders and leave as much comments in the code as possible.
### File system
* The major folder is `/src/bot`. There you should put all skills clusters for all IM Platforms.
* In folder `/src/bot/skills/clusters` you should put only reusable (between different platforms) skills and skills clusters.
* In folder `/src/bot/platforms/` you should put unique, not reusable skills and clusters.

### Code
I use [Express](http://expressjs.com/), so let's check routes. In the `index.js` file look at

**/src/index.js**
```js
...
// This is your bot's router
import yourBotMessengerRouter from './bot/platforms/messenger/bot-name/router-builder';

...
// This route should be in the messenger webhook
buildRoute(router, '/messenger/yourbot', yourBotMessengerRouter, {});
```

`'/messenger/yourbot'` here is a url, that you need to specify in your messenger webhooks. For example `https://yourbot.app.com/messenger/yourbot`.

`buildRoute` just add provided routes to the router.

`yourBotMessengerRouter` – is the most important part. There you can add or remove different services, that you want to use (for example, Google Storage, Memcached, Wit.ai and others) in your skills. Also you specify the initial Skills Cluster:
 
 **/bot/platforms/messenger/bot-name/router-builder.js**
 ```js
 ...
 req.bot.normalized.forEach(bot => co(skillsCluster(initContext(bot)))); // skillsCluster is a core cluster of skills 
 ...
 ```