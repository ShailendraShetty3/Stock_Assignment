import React, { useEffect, useState } from "react";
import { Card } from "antd";
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
import { useSelector, useDispatch } from "react-redux";
import { updateWebsocketData } from '../Redux/stocksSlice'; // Adjust path as per your file structure

const Chartdata = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState({
    "NSE:26000": [],
    "NSE:26009": [],
    "NSE:212": [],
  });

  const visibleStocks = useSelector((state) => state.watchlist.visibleStocks);
  const websocketData = useSelector((state) => state.watchlist.websocketData);

  useEffect(() => {
    // Update data whenever visibleStocks or websocketData changes
    const newData = {};
    for (const symbol of visibleStocks) {
      newData[symbol] = websocketData[symbol] || [];
    }



    // setData(newData);

    console.log("the chart data ..........................")

    
    console.log(websocketData)


    /////

    try {
      const receivedData = JSON.parse(websocketData.data);
      
      console.log("the recieved data is ")
        console.log(receivedData)
      if (receivedData.type === "Data") {
        const symbol = receivedData.data.symbol;
        setData((prevData) => {
          const newData = { ...prevData };
          newData[symbol] = [...newData[symbol], receivedData.data];
          return newData;
        });
      } else {
        console.warn("Unexpected message type:", receivedData.type);
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  
  }, [visibleStocks, websocketData]);

  // useEffect(() => {
  //   // Example of dispatching the action to update websocketData
  //   const data = {
  //     timestamp_str: '2024-01-25 12:31:36',
  //     symbol: 'NSE:26000',
  //     ltp: 22519,
  //     prev_day_close: 170.6,
  //     // Include other fields as needed
  //   };
  //   dispatch(updateWebsocketData(data));
  // }, [dispatch]);

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

  const shouldRenderChart = (symbol) => data.hasOwnProperty(symbol);

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

      {visibleStocks.map(symbol => (
        shouldRenderChart(symbol) && (
          <div key={symbol}>
            <h3>{getStockName(symbol)}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data[symbol]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp_str" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ltp" stroke="#8884d8" />
                {/* Add more lines for additional series if needed */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      ))}
      
    </Card>
  );
};

export default Chartdata;
