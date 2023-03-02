import { getSpiritPrice, price_filename } from "./extract.js";
import { transformData, populatePg, reportOnData, getPool } from "./load.js";
import * as fs from "fs";

async function main() {
  const price = await getSpiritPrice();
  //console.log(price);
  let price_string = JSON.stringify(price, undefined, 4);
  reportOnData(price);
  fs.writeFileSync(price_filename, price_string, "utf8");
  //const raw_data = await loadData();
  const transformedData = await transformData(price);
  console.log("tlen", transformedData.length);
  reportOnData(transformedData);
  //const id = await insertTimestep(transformedData[0], client);
  //console.log(transformedData);
  const client = getPool();
  const ids = await populatePg(transformedData, false, client);
  //console.log(ids.map((x) => x.rowCount));
}

main();
