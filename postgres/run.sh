#! /bin/bash
# Runs with the default entrypoint defined in the Dockerfile
echo $PGPASS
echo $PGPASSWORD

DATAPATH=~/data/pgtsdata
export DOCKERNAME="tsapostgres"
docker run \
      --name $DOCKERNAME \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=$PGPASS \
      -v $DATAPATH:/var/lib/postgresql/data \
      -p 5432:5432 \
      -d postgres

node index.js
