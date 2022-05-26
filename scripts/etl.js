import { getSpiritPrice } from "./extract.js";
import { transformData, populate } from "./load.js";
import * as fs from "fs";

const price_filename = "data/price.json";

async function main() {
  const price = await getSpiritPrice();

  console.log(price);
  let price_string = JSON.stringify(price, undefined, 4);
  fs.writeFileSync(price_filename, price_string, "utf8");
  //const raw_data = await loadData();
  const transformedData = await transformData(price);
  //const id = await insertTimestep(transformedData[0], client);
  //console.log(transformedData);
  const ids = await populate(transformedData);
  console.log(ids.map((x) => x.rowCount));
}

main();
