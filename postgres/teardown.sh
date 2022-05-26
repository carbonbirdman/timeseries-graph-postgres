#! /bin/bash
#docker stop tsa-postgres
#docker rm tsa-postgres
export DOCKERNAME="tsapostgres"
docker stop $DOCKERNAME
docker rm $DOCKERNAME
rm -fr ~/data/pgtsdata
