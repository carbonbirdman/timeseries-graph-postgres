// Start with some exploratory queries
import { request, gql } from "graphql-request";
import * as fs from "fs";
//const gqlr = require("graphql-request");
const SPIRIT_GRAPH =
  "https://api.thegraph.com/subgraphs/name/layer3org/spiritswap-analytics";
var spirit_pool_address = "0x4fe6f19031239f105f753d1df8a0d24857d0caa2";

const SWAPS = gql`
  query MyQuery($pair: String!) {
    swaps(
      orderBy: timestamp
      orderDirection: desc
      first: 100
      skip: 0
      where: { pair: $pair }
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

export async function getSwapPricesReserves(data_url) {
  try {
    let data = await request(data_url, SWAPS, { pair: spirit_pool_address });
    console.log(Object.keys(data));
    let values = Object.values(data[Object.keys(data)[0]]);

    console.log("time", data);
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

export async function getSpiritPrice() {
  var info = await getSwapPricesReserves(SPIRIT_GRAPH);
  console.log(info);
  return info;
}

getSpiritPrice().then((price) => {
  console.log(price);
  let price_string = JSON.stringify(price, undefined, 4);
  fs.writeFileSync("data/price.json", price_string, "utf8");
});
