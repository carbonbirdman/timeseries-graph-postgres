// Start with some exploratory queries
import { request, gql } from "graphql-request";
import * as fs from "fs";
export const price_filename = "price.json";

//const gqlr = require("graphql-request");
const SPIRIT_GRAPH =
  "https://api.thegraph.com/subgraphs/name/layer3org/spiritswap-analytics";
var spirit_pool_address = "0x4fe6f19031239f105f753d1df8a0d24857d0caa2";

const SWAPS = gql`
  query MyQuery($pair: String!, $timestamp0: String!, $timestamp1: String!) {
    swaps(
      orderBy: timestamp
      orderDirection: desc
      first: 9
      skip: 0
      where: {
        pair: $pair
        timestamp_lte: $timestamp1
        timestamp_gte: $timestamp0
      }
    ) {
      amount0In
      amount1Out
      amount0Out
      amount1In
      timestamp
      amountUSD

      transaction {
        blockNumber
      }

      pair {
        reserve0
        reserve1
        reserveUSD
        totalSupply
        token1Price

        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
    }
  }
`;

const VERBOSE = true;
// Retrieve query of the swaps table in the subgraph
// over a maximum time interval number of minutes
// subgraph timestamps are seconds, unix timestamps are milliseconds
// so divide unix timestamps by 1000
// offset is the milliseconts offset
export async function getSwapPricesReserves(data_url, interval) {
  const offset = interval * 1000 * 60;
  const currentTime = new Date();
  const ts1 = String(parseInt(currentTime.getTime() / 1000, 10));
  const ts0 = String(parseInt((currentTime.getTime() - offset) / 1000, 10));
  //console.log(currentTime);
  //const d1 = new Date(currentTime.getTime());
  //const d0 = new Date(currentTime.getTime() - offset);
  //console.log("D", d1, d0);
  //console.log("interval", ts0, ts1);
  try {
    let data = await request(data_url, SWAPS, {
      pair: spirit_pool_address,
      timestamp0: ts0,
      timestamp1: ts1
    });
    //console.log(Object.keys(data));
    let values = Object.values(data[Object.keys(data)[0]]);
    if (VERBOSE) console.log(values);
    let A = values.map((x) => ({
      ...x,
      index: new Date(x.timestamp * 1000),
      value:
        x.amount0In > 0
          ? x.amount1Out / x.amount0In
          : x.amount1In / x.amount0Out,
      timestamp: x.timestamp
    }));
    return A;
  } catch (err) {
    console.log(err);
  }
}

export async function getSpiritPrice(minutes = 1) {
  const priceData = await getSwapPricesReserves(SPIRIT_GRAPH, minutes);
  //console.log(info);
  return priceData;
}

function main() {
  getSpiritPrice().then((price) => {
    //console.log(price);
    let price_string = JSON.stringify(price, undefined, 4);
    fs.writeFileSync(price_filename, price_string, "utf8");
  });
}

//main();
