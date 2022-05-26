// Can we connect to postgres on my VM?
// 34.71.135.230
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Pool, Client } = require("pg");

const credentials = require("./connection.json");
console.log(credentials);
const client = new Pool(credentials);

async function pgtest() {
  await client.connect();
  client.query("SELECT * FROM price", (err, res) => {
    console.log(err, res);
    const prices = res.rows.map((x) => x["price"]);
    console.log(prices);
    client.end();
  });
}

pgtest();

var dbname = "nodetable";
async function main() {
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${dbname};`);
  await client.query(`CREATE DATABASE ${dbname};`);
  await client.end();
}
