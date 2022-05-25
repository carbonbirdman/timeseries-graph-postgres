const { Pool, Client } = require("pg");

const credentials = require("../scripts/connection.json");

async function insertTimestep(ts, client) {
  const text = `
    INSERT INTO price (time, token, dex, price)
    VALUES ($1, $2, $3, $4 )
    RETURNING id
  `;
  const values = [ts.time, ts.token, ts.dex, ts.price];
  return await client.query(text, values);
}

async function populate() {
  const client = new Client(credentials);
  await client.connect();
  const insertResult = await insertTimestep(
    {
      time: "2022-05-23 00:00:00",
      token: "BTC",
      dex: "SPOOKY",
      price: "10"
    },
    client
  );
  const id = insertResult;
  console.log(id);
  await client.end();
}

async function check() {
  const client = new Client(credentials);
  await client.connect();

  client.query("SELECT * FROM price", (err, res) => {
    //console.log(err, res);
    const prices = res.rows.map((x) => x["price"]);
    console.log(prices);
    client.end();
  });
}

populate();
console.log(check());
