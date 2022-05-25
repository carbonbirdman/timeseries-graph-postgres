const express = require("express");

const app = express();
app.set("view engine", "eta");

const credentials = require("../connection.json");

const port = 8080;

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

app.get("/data", (req, res) => {
  let lines = check();
  console.log(lines);
  res.send(lines);
});

const { Client } = require("pg");

async function check() {
  const client = new Client(credentials);
  await client.connect();
  var outlines = "";
  client.query("SELECT * FROM price", (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });
}

//app.post("/write", async (req, res) => {
//  try {
//    const { description } = req.body;
//    const newPrice = await client.query(
//      "INSERT INTO price  VALUES ($1) RETURNING *",
//      [description]
//    );
//    res.json(newTodo.rows[0]);
//  } catch (error) {
//    console.log(error.message);
//  }
//});
