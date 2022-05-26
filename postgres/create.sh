#! /bin/bash
echo $PGPASS
echo $PGPASSWORD
DATAPATH=~/data/pgtsdata
mkdir -p $DATAPATH
export DOCKERNAME="tsapostgres"
docker run \
      --name $DOCKERNAME \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=$PGPASS \
      -v $DATAPATH:/var/lib/postgresql/data \
      -p 5432:5432 \
      -d postgres

./waitForContainer.sh

docker exec -ti -u postgres $DOCKERNAME psql -c "CREATE USER tsauser WITH ENCRYPTED PASSWORD 'password';"
#docker exec -ti -u postgres -e PASSWORD=$PGPASSWORD $DOCKERNAME psql -c "CREATE USER tsauser WITH ENCRYPTED PASSWORD '{$PASSWORD}';"
docker exec -ti -u postgres -e PGPASSWORD=$PGPASSWORD $DOCKERNAME psql -U postgres -c "CREATE DATABASE tsauser;"
docker exec -ti -u postgres $DOCKERNAME psql -c "ALTER ROLE tsauser CREATEDB;"
docker exec -ti -u postgres -e PGPASSWORD=$PGPASSWORD $DOCKERNAME psql -U tsauser -c "CREATE DATABASE tsadb OWNER tsauser;"
docker exec -ti -u postgres -e PGPASSWORD=$PGPASSWORD $DOCKERNAME psql -U tsauser -d tsadb -c "CREATE TABLE  price( \
  id BIGSERIAL, \
  time TIMESTAMP, \
  token VARCHAR(5), \
  dex VARCHAR(10), \
  price  FLOAT8 \
);" 
#docker exec -ti -u postgres $DOCKERNAME psql -c "GRANT ALL PRIVILEGES ON DATABASE tsadb TO tsauser;"

#yarn add pg
#yarn add express
#node populate.js
#node index.js
