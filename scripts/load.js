import * as fs from "fs";
import { price_filename } from "./extract.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Pool, Client } = require("pg");

export function getPool() {
  const credentials = require("./connection.json");
  credentials.host = process.env.POSTGRESHOST;
  credentials.password = process.env.PGPASS;
  console.log(credentials);
  const client = new Pool(credentials);
  return client;
}

function loadJSON() {
  var priceArray = JSON.parse(fs.readFileSync(price_filename));
  //console.log(priceArray);
  return priceArray;
}

export function reportOnData(priceArray) {
  console.log("Type", typeof priceArray);
  console.log("Size", priceArray.length);
  console.log("First element", priceArray[0]);
  //console.log(priceArray.timestamp.toISOString());
}

export function transformData(rawData) {
  const transformed = rawData.map((x) => ({
    time: x.index,
    token: x.pair.token0.symbol,
    dex: "spirit",
    price: x.value
  }));
  return transformed;
}

async function tableExists(client) {
  const text = `SELECT EXISTS (
    SELECT FROM 
        tsadb
    WHERE 
        tablename  = 'spirit'
    );`;
  return await client.query(text);
}

//CREATE TABLE IF NOT EXISTS  ( \
//  id BIGSERIAL, \
//  time TIMESTAMP, \
//  token VARCHAR(5), \
//  dex VARCHAR(10), \
//  price  FLOAT8 \
//);"

async function insertTimestep(ts, client) {
  const text = `
    INSERT INTO price (time, token, dex, price)
    VALUES ($1, $2, $3, $4 )
    RETURNING id
  `;
  const values = [ts.time, ts.token, ts.dex, ts.price];
  return await client.query(text, values);
}

export async function populatePg(transformedData, dryrun, client) {
  //await client.connect();
  //const idPs = transformedData.map((x) => {
  //  insertTimestep(x, client);
  //});
  //const ids = await Promise.all(idPs);
  console.log(client);
  let ids = [];
  for (const row in transformedData) {
    if (dryrun) {
      //console.log("test");
      //console.log(transformedData[row]);
    } else {
      ids[row] = insertTimestep(transformedData[row], client);
    }
  }
  return await Promise.all(ids);
}

//main();
//populate();
