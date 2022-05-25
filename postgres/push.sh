export PGHOST=127.0.0.1
export PGUSER=tsa-user
export PGPASSWORD=$PGPASS
heroku pg:push postgres DATABASE_URL --app swiss-army-knife-101
