#!/bin/sh

# Let's make the script more robust:
#   -e: fail fast if any command in the script fails
#   -u: check that all variables used in this script are set (if not, exit)
#   -o pipefail: fail even faster, if an error occures in a pipeline
set -eu -o pipefail

# include parse_yaml function
. ./tools/libs/parse-yaml.sh

# read yaml file
eval $(parse_yaml app-dev.yaml "")

NEW_RELIC_APP_NAME=$env_variables_NEW_RELIC_APP_NAME NEW_RELIC_LICENSE=$env_variables_NEW_RELIC_LICENSE LOGGING_LEVEL=$env_variables_LOGGING_LEVEL APP_WIT_TOKEN=$env_variables_APP_WIT_TOKEN APP_WIT_VERSION=$env_variables_APP_WIT_VERSION GOOGLE_PROJECT_ID=$env_variables_GOOGLE_PROJECT_ID  MEMCACHE_PORT_11211_TCP_ADDR=$env_variables_MEMCACHE_PORT_11211_TCP_ADDR MEMCACHE_PORT_11211_TCP_PORT=$env_variables_MEMCACHE_PORT_11211_TCP_PORT FACEBOOK_PAGE_TOKEN=$env_variables_FACEBOOK_PAGE_TOKEN NODE_ENV=development nodemon dist/index.js
