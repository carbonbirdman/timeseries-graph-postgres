// Server to run a regular pull down of data
// from a subgraph and save to postgres
import { getSpiritPrice } from "../scripts/extract.js";
import { transformData, reportOnData, getPool } from "../scripts/load.js";
import { reportDB } from "../scripts/pgcon.js";

import { createRequire } from "module";
//import { getSwapPricesReserves } from "../scripts/extract.js";
const require = createRequire(import.meta.url);
const express = require("express");
var eta = require("eta");
//require("dotenv").config();

const app = express();
app.set("view engine", "eta");

//app.use((req, res, next) => {
//  res.header("Access-Control-Allow-Origin", "*");
//  next();
//});

// SIMPLE HOURLY
const cron = require("node-cron");
cron.schedule("7 27 * * * *", () => {
  console.log("running a task every hour");
});

// SIMPLE MINUTELY
cron.schedule("7 * * * * *", () => {
  console.log("running a task every minute");
  var price = "None";
  async function getTimeseries() {
    try {
      const priceOut = await getSpiritPrice(1);
      const transformedData = await transformData(priceOut);
    } catch (error) {
      console.log("Error retriving subgraph data");
    }
  }
  const ts = getTimeseries();
});

//console.log("Config:", process.env.CONFIG_WEB);
//const cfg = require(process.env.CONFIG_WEB);
//console.log("Config id:", cfg.id);
const port = 8080;
var indexTemplate = `
<!DOCTYPE html>
<head></head>
<body>
<h1>Graph-Node-Postgres-React</h1>
<p>Get from postgres server as JSON</p>
<% it.xp %>
<% it.links.forEach(function(item){ %>
  <a href=" <%= item %> "><%= item %> </a> <br/>
<% }) %>
<p>end</p>
</body>
`;

app.get("/", (req, res) => {
  res.send(
    eta.render(indexTemplate, {
      xp: "input text",
      links: ["data", "postgres", "query"]
    })
  );
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
  //var conn = dexes.get_connection();
});

app.get("/data", (req, res) => {
  //get();
});

// GET route for postgres
//
const credentials = require("../scripts/connection.json");
// build a url for the postgres database and access it
// unless
credentials.host = process.env.POSTGRESHOST;
credentials.password = process.env.PGPASS;
app.get("/postgres", (req, res) => {
  var dburl =
    "postgres://" +
    credentials.user +
    ":" +
    credentials.password +
    "@" +
    credentials.host +
    ":" +
    credentials.port +
    "/" +
    "tsadb";
  const { Client } = require("pg");
  const client = new Client({
    connectionString: process.env.DATABASE_URL || dburl
  });
  client.connect();

  client.query(
    "SELECT table_schema,table_name FROM information_schema.tables WHERE table_schema==public;",
    (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
      client.end();
    }
  );
});
