// import React, { useEffect, useState } from "react";
// import { Card, message } from "antd";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const Chartdata = () => {
//   const [data, setData] = useState({
//     "NSE:26000": [],
//     "NSE:26009": [],
//     "NSE:212": [],
//   });

//   useEffect(() => {
//     const token = "abcd"; // Replace with your token if required
//     const wsUrl = `ws://localhost:8000/dataWS?token=${token}`;
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       console.log("WebSocket connection established");
//       message.success("WebSocket connection established");

//       // Send subscription message for all tokens
//       const subscriptionMessage = JSON.stringify({
//         action: "subscribe",
//         tokens: ["NSE:26000", "NSE:26009", "NSE:212"],
//       });
//       ws.send(subscriptionMessage);
//       console.log("Subscription message sent:", subscriptionMessage);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const receivedData = JSON.parse(event.data);
//         if (receivedData.type === "Data") {
//           const symbol = receivedData.data.symbol;
//           setData((prevData) => {
//             const newData = { ...prevData };
//             newData[symbol] = [...(newData[symbol] || []), receivedData.data];
//             return newData;
//           });
//         } else {
//           console.warn("Unexpected message type:", receivedData.type);
//         }
//       } catch (err) {
//         console.error("Error parsing WebSocket message:", err);
//       }
//     };

//     ws.onerror = (event) => {
//       console.error("WebSocket error:", event);
//       message.error("WebSocket error");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket connection closed");
//       message.info("WebSocket connection closed");
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   const getStockName = (symbol) => {
//     switch (symbol) {
//       case "NSE:26000":
//         return "NIFTY";
//       case "NSE:26009":
//         return "BANKNIFTY";
//       case "NSE:212":
//         return "ASHOKLEY";
//       default:
//         return symbol;
//     }
//   };

//   return (
//     <Card
//       bordered={false}
//       style={{
//         width: "50%",
//         height: "100%",
//         overflowY: "auto",
//       }}
//     >
//       <h2>Stock Graph</h2>
//       <div>
//         {Object.keys(data).map((symbol) => (
//           <div key={symbol}>
//             <h3>{getStockName(symbol)}</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={data[symbol]}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="timestamp_str" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="ltp" stroke="#8884d8" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         ))}
//       </div>
//     </Card>
//   );
// };

// export default Chartdata;

import React, { useEffect, useRef, useState } from "react";
import { Card, message } from "antd";
import {
  createChart,
  CrosshairMode,
  PriceLineSource,
} from "lightweight-charts";

const Chartdata = () => {
  const [data, setData] = useState({
    "NSE:26000": [],
    "NSE:26009": [],
    "NSE:212": [],
  });

  const chartRefs = useRef({});
  const lineSeriesRefs = useRef({});

  useEffect(() => {
    const token = "abcd"; // Replace with your token if required
    const wsUrl = `ws://localhost:8000/dataWS?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      message.success("WebSocket connection established");

      // Send subscription message for all tokens
      const subscriptionMessage = JSON.stringify({
        action: "subscribe",
        tokens: ["NSE:26000", "NSE:26009", "NSE:212"],
      });
      ws.send(subscriptionMessage);
      console.log("Subscription message sent:", subscriptionMessage);
    };

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        if (receivedData.type === "Data") {
          const symbol = receivedData.data.symbol;

          // Immediately sort data by timestamp
          const newData = [...data[symbol], receivedData.data].sort(
            (a, b) => new Date(a.timestamp_str) - new Date(b.timestamp_str)
          );

          setData((prevData) => ({
            ...prevData,
            [symbol]: newData,
          }));

          if (lineSeriesRefs.current[symbol]) {
            updateChart(symbol);
          }
        } else {
          console.warn("Unexpected message type:", receivedData.type);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      message.error("WebSocket error");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      message.info("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const getStockName = (symbol) => {
    switch (symbol) {
      case "NSE:26000":
        return "NIFTY";
      case "NSE:26009":
        return "BANKNIFTY";
      case "NSE:212":
        return "ASHOKLEY";
      default:
        return symbol;
    }
  };

  useEffect(() => {
    Object.keys(data).forEach((symbol) => {
      if (!chartRefs.current[symbol]) {
        const chartContainer = document.getElementById(`chart-${symbol}`);
        const chart = createChart(chartContainer, {
          width: chartContainer.clientWidth,
          height: 300,
          crosshair: {
            mode: CrosshairMode.Normal,
          },
        });
        chartRefs.current[symbol] = chart;

        const lineSeries = chart.addLineSeries({
          priceLineSource: PriceLineSource.LastVisibleValue,
        });
        lineSeriesRefs.current[symbol] = lineSeries;
      }

      updateChart(symbol);
    });
  }, [data]);

  const updateChart = (symbol) => {
    const chartData = data[symbol].map((point) => ({
      time: new Date(point.timestamp_str.replace(/-/g, "/")).getTime(), // Adjusting for compatibility with Date constructor
      value: point.ltp,
    }));

    lineSeriesRefs.current[symbol].setData(chartData);
  };

  return (
    <Card
      bordered={false}
      style={{
        width: "50%",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <h2>Chart</h2>
      <div>
        {Object.keys(data).map((symbol) => (
          <div key={symbol}>
            <h3>{getStockName(symbol)}</h3>
            <div id={`chart-${symbol}`} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Chartdata;
