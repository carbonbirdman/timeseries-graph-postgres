import * as React from "react";
import Plot from "react-plotly.js";
import * as d3 from "d3";

const data_url = "https://url";

async function getTimeseries(url) {
  //let response = await getPriceTimeseries(url);
  //console.log(response);
  //return response;
}

const DisplayTimeseries = ({ url }) => {
  const [tsData, setTsData] = React.useState("none");
  const [inputUrl, setInputUrl] = React.useState(url);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        console.log("inputurl", inputUrl);
        let tsData = await getTimeseries(inputUrl);
        // bounds
        console.log("tp", tsData[tsData.length - 1]);
        tsData = tsData.reverse();
        let t0 = tsData[0].timestamp;
        let t1 = tsData[tsData.length - 1].timestamp;
        console.log("t", t0, t1);
        //let bt = beetsData.map((x) => x.timestamp);
        setTsData(tsData);
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [inputUrl]);
  return (
    <div>
      {tsData === "none" ? (
        <p> Loading ... </p>
      ) : (
        <div>
          <div>
            <PriceTimeseries tsData={tsData} setBeetsData={setTsData} />
          </div>
        </div>
      )}
    </div>
  );
};

const PriceTimeseries = ({ tsData, setTsData }) => {
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {}, [tsData]);
  return (
    <div>
      {" "}
      <p>Result: {typeof beetsData}</p>
      <Plot
        data={[
          {
            x: tsData.map((a) => a.index),
            y: tsData.map((a) => a.value),
            type: "scatter",
            mode: "markers",
            marker: { color: "blue" }
          }
        ]}
        //layout={{ yaxis: { range: [8, 8.5] } }}
        config={{
          responsive: true
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <DisplayTimeseries url={data_url} />
    </div>
  );
}
