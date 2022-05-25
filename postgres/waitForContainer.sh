#! /bin/bash
# https://www.marksayson.com/blog/wait-until-docker-containers-initialized/
set -e
MAX_TRIES=9
export DOCKERNAME="tsapostgres"

function dbIsReady(){
docker logs $DOCKERNAME | grep "PostgreSQL init process complete"
}

function whenReady(){
    attempt=1
    while [ $attempt -le $MAX_TRIES ]; do
        if "$@"; then
            echo "$2 is up"
            break
        fi
            echo "Waiting for $2 attempt: $((attempt++))"
            sleep 5
        done

    if [ $attempt -gt $MAX_TRIES ]; then
        echo "Too many tries"
        exit 1
    fi
}

whenReady dbIsReady "Postgres"
