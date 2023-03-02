// Test the connection to postgres on my
// Relies on environment variables for host and password
// 34.71.135.230
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Pool, Client } = require("pg");

async function connectPool() {
  const credentials = require("./connection.json");
  credentials.host = process.env.POSTGRESHOST;
  credentials.password = process.env.PGPASS;
  const client = new Pool(credentials);
  console.log(credentials);
  return client;
}

async function connectClient() {
  const credentials = require("./connection.json");
  credentials.host = process.env.POSTGRESHOST;
  credentials.password = process.env.PGPASS;
  const client = new Client(credentials);
  return client;
}

async function pgtest(client) {
  //console.log(client);
  console.log(client.query);
  let result = await client.query("SELECT * FROM price", (err, res) => {
    //console.log(err, res);
    const price = res.rows.map((x) => x["price"]);
    const time = res.rows.map((x) => x["time"]);
    console.log("elements", price.length);
    //console.log(price);
    //console.log(time);
    console.log(new Date(time[0]).getTime());
  });
  //Promise.all(result);
}

var dbname = "nodetable";
async function replaceTable(client) {
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${dbname};`);
  await client.query(`CREATE DATABASE ${dbname};`);
  await client.end();
}

export async function reportDB(client) {
  await client.connect();
  await client.query(
    `SELECT table_schema,table_name 
  FROM information_schema.tables 
  WHERE table_schema='public';`,
    async (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
    }
  );
  await client.end();
}

async function main() {
  const client = await connectPool();
  pgtest(client);
  //reportDB(client);
}

main();
