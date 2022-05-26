#! /bin/bash
# https://www.marksayson.com/blog/wait-until-docker-containers-initialized/
set -e
MAX_TRIES=9
export DOCKERNAME="tsapostgres"
# 2022-05-26 06:18:34.213 UTC [1] LOG:  database system is ready to accept connections
function dbIsReady(){
docker logs $DOCKERNAME | grep "PostgreSQL init process complete"
#docker logs $DOCKERNAME | grep "PostgreSQL Database directory appears to contain a database"
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
