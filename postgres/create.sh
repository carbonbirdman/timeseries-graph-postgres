#! /bin/bash
mkdir -p ./data/pg-ts
export $PG_PASS=password
docker run \
      --name tsa-postgres \
      -e POSTGRES_PASSWORD=$PGPASS \
      -e POSTGRES_USER=tsa-user \
      -e POSTGRES_DB=tsa-db \
      -v ~/data/pg-ts:/var/lib/postgresql/data
      -p 5432:5432 \
      -d postgres

./waitForContainer.sh

docker exec -ti -u postgres postgres psql -c "CREATE DATABASE tsa-db;"

docker exec -ti -u postgres postgres psql -c "CREATE TABLE  price( \
  id BIGSERIAL, \
  time TIMESTAMP, \
  token VARCHAR(5), \
  dex VARCHAR(10), \
  price  FLOAT8 \
);" kestrel

#yarn add pg
#yarn add express
#node populate.js
#node index.js
