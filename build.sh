#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

SERVICE_NAME=myntplayer
TAG_PREFIX=maktouch

if [[ -z "${COMMIT_SHA:-}" ]] ; then
  COMMIT_SHA="dev-test"
fi

TAG=$TAG_PREFIX/$SERVICE_NAME:$COMMIT_SHA

# get the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "+++ :docker: Building $SERVICE_NAME...."
docker build . -f $DIR/Dockerfile --build-arg COMMIT=$COMMIT_SHA -t $TAG
echo "+++ :docker: Container Size: $(docker images $TAG --format "{{.Size}}")"