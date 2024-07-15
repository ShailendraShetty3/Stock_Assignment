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
// import { useSelector } from 'react-redux'; // Import useSelector

// const Chartdata = () => {
//   const [data, setData] = useState({
//     "NSE:26000": [],
//     "NSE:26009": [],
//     "NSE:212": [],
//   });
//   const visibleStocks = useSelector((state) => state.watchlist.visibleStocks); // Get visibleStocks from Redux

//   useEffect(() => {
//     const token = "abcd"; // Replace with your token if required
//     const wsUrl = `ws://localhost:8000/dataWS?token=${token}`;
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       console.log("WebSocket connection established");
//       message.success("WebSocket connection established");

//       // Send subscription messages for visible stocks
//       const subscriptionMessage = JSON.stringify({
//         action: "subscribe",
//         tokens: visibleStocks, // Use visibleStocks from Redux
//       });
//       ws.send(subscriptionMessage);
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
//   }, [visibleStocks]); // Re-run useEffect when visibleStocks changes

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

//   // Check if NSE:26000 is present in visibleStocks before rendering the chart
//   const shouldRenderNiftyChart = visibleStocks.includes("NSE:26000");
//   const shouldRenderBankNiftyChart = visibleStocks.includes("NSE:26009");
//   const shouldRenderAshokChart = visibleStocks.includes("NSE:212");

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
//       {shouldRenderNiftyChart && (
//         <div>
//           <h3>{getStockName("NSE:26000")}</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data["NSE:26000"]}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="timestamp_str" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="ltp" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}

// {shouldRenderBankNiftyChart && (
//         <div>
//           <h3>{getStockName("NSE:26009")}</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data["NSE:26000"]}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="timestamp_str" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="ltp" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}


// {shouldRenderAshokChart && (
//         <div>
//           <h3>{getStockName("NSE:26009")}</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data["NSE:212"]}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="timestamp_str" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="ltp" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </Card>
//   );
// };

// export default Chartdata;

















import React, { useEffect } from "react";
import { Card, message } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { updateWebsocketData } from '../Redux/stocksSlice'; // Adjust the import path accordingly

const Chartdata = () => {
  const dispatch = useDispatch();
  const visibleStocks = useSelector((state) => state.watchlist.visibleStocks); // Get visibleStocks from Redux
  const websocketData = useSelector((state) => state.watchlist.websocketData); // Get websocketData from Redux

  useEffect(() => {
    const token = "abcd"; // Replace with your token if required
    const wsUrl = `ws://localhost:8000/dataWS?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      message.success("WebSocket connection established");

      // Send subscription messages for visible stocks
      const subscriptionMessage = JSON.stringify({
        action: "subscribe",
        tokens: visibleStocks, // Use visibleStocks from Redux
      });
      ws.send(subscriptionMessage);
    };

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        if (receivedData.type === "Data") {
          const symbol = receivedData.data.symbol;
          dispatch(updateWebsocketData({ symbol, data: receivedData.data })); // Dispatch the updateWebsocketData action
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
  }, [visibleStocks, dispatch]); // Re-run useEffect when visibleStocks changes

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

  // Check if each stock is present in visibleStocks before rendering the chart
  const shouldRenderChart = (symbol) => visibleStocks.includes(symbol);

  return (
    <Card
      bordered={false}
      style={{
        width: "50%",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <h2>Stock Graph</h2>
      {shouldRenderChart("NSE:26000") && (
        <div>
          <h3>{getStockName("NSE:26000")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={websocketData["NSE:26000"]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp_str" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ltp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {shouldRenderChart("NSE:26009") && (
        <div>
          <h3>{getStockName("NSE:26009")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={websocketData["NSE:26009"]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp_str" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ltp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {shouldRenderChart("NSE:212") && (
        <div>
          <h3>{getStockName("NSE:212")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={websocketData["NSE:212"]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp_str" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ltp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default Chartdata;
