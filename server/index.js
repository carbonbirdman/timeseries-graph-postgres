import { createRequire } from "module";
//import { get } from "./scripts/getdata.js";
const require = createRequire(import.meta.url);
const express = require("express");
var eta = require("eta");
require("dotenv").config();

const app = express();
app.set("view engine", "eta");

//console.log("Config:", process.env.CONFIG_WEB);
//const cfg = require(process.env.CONFIG_WEB);
//console.log("Config id:", cfg.id);
const port = 8080;
var indexTemplate = `
<!DOCTYPE html>
<head></head>
<body>
<h1>Graph-Node-Postgres-React</h1>
<p>Get from postgres serve as JSON</p>
<% it.xp %>
<% it.links.forEach(function(item){ %>
  <a href=" <%= item %> "><%= item %> </a>
<% }) %>
<p>end</p>
</body>
`;

app.get("/", (req, res) => {
  res.send(
    eta.render(indexTemplate, {
      xp: "input text",
      links: [""]
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

var dburl = "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase";
const { Client } = require("pg");
const client = new Client({
  connectionString: process.env.DATABASE_URL || dburl,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();

client.query(
  "SELECT table_schema,table_name FROM information_schema.tables;",
  (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  }
);

//app.use((req, res, next) => {
//  res.header("Access-Control-Allow-Origin", "*");
//  next();
//});
