import React, { useEffect, useState } from "react";
import { Table, message, Card, Button } from "antd";
import Plus from "../Images/plusIcon.png";
import Delete from "../Images/deleteIcon.png";
import { useDispatch, useSelector } from 'react-redux';
import { addStock, removeStock, updateWebsocketData } from '../Redux/stocksSlice';

const WebSocketTable = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist);
  

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [visibleStocks, setVisibleStocks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ws, setWs] = useState(null); // State to hold WebSocket instance
  const [isConnected, setIsConnected] = useState(false); // State to track WebSocket connection

  // Load selected stocks from local storage on initial mount
  useEffect(() => {
    const savedSelectedStocks =
      JSON.parse(localStorage.getItem("selectedStocks")) || [];
    setVisibleStocks(savedSelectedStocks);

    // Establish WebSocket connection
    const token = "abcd"; // Replace with your token if required
    const wsUrl = `ws://localhost:8000/dataWS?token=${token}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("WebSocket connection established");
      message.success("WebSocket connection established");
      setWs(websocket); // Save WebSocket instance to state after connection
      setIsConnected(true); // Set connection state to true

      // Dispatch action to update the watchlist in Redux store
      const watchlistData = ["NIFTY", "BANKNIFTY", "ASHOKLEY"]; // Replace with your actual watchlist data
    };

    websocket.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        if (receivedData.type === "Data") {
          setData((prevData) => {
            const index = prevData.findIndex(
              (item) => item.symbol === receivedData.data.symbol
            );
            if (index !== -1) {
              // Update existing row
              const newData = [...prevData];
              newData[index] = receivedData.data;
              //
              dispatch(updateWebsocketData(receivedData.data));
              
              return newData;
            } else {
              // Add new row
              return [...prevData, receivedData.data];
            }
          });
        } else {
          console.warn("Unexpected message type:", receivedData.type);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
        setError("Error parsing WebSocket message");
      }
    };

    websocket.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket error");
      message.error("WebSocket error");
    };

    websocket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      message.info("WebSocket connection closed");
      setIsConnected(false); // Set connection state to false
    };

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []); // Establish WebSocket connection only once on component mount

  // Save selected stocks to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedStocks", JSON.stringify(visibleStocks));

    // Send subscription messages for newly added stocks
    if (ws && isConnected) {
      const newlyAddedStocks = visibleStocks.filter(
        (stock) => !data.find((item) => item.symbol === stock)
      );
      newlyAddedStocks.forEach((stock) => {
        const subscriptionMessage = JSON.stringify({
          action: "subscribe",
          tokens: [stock],
        });
        ws.send(subscriptionMessage);
        console.log("Subscription message sent:", subscriptionMessage);
      });

      // Send unsubscription messages for removed stocks
      const removedStocks = data
        .map((item) => item.symbol)
        .filter((stock) => !visibleStocks.includes(stock));
      removedStocks.forEach((stock) => {
        const unsubscriptionMessage = JSON.stringify({
          action: "unsubscribe",
          tokens: [stock],
        });
        ws.send(unsubscriptionMessage);
        console.log("Unsubscription message sent:", unsubscriptionMessage);
      });
    }
  }, [visibleStocks, data, ws, isConnected]);

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

  const handleRemoveStock = (stock) => {
    setVisibleStocks((prevVisibleStocks) =>
      prevVisibleStocks.filter((s) => s !== stock)
    );
    dispatch(removeStock(stock));
  };

  const handleAddStock = (stock) => {
    setVisibleStocks((prevVisibleStocks) => [...prevVisibleStocks, stock]);
    dispatch(addStock(stock));
  };
  
  const availableStocks = ["NSE:26000", "NSE:26009", "NSE:212"].filter(
    (stock) => !visibleStocks.includes(stock)
  );

  const columns = [
    {
      title: "Stock Name",
      dataIndex: "symbol",
      key: "stock_name",
      render: (text) => getStockName(text),
    },
    { title: "Timestamp", dataIndex: "timestamp_str", key: "timestamp_str" },
    { title: "Symbol", dataIndex: "symbol", key: "symbol" },
    { title: "LTP", dataIndex: "ltp", key: "ltp" },
    { title: "Turnover", dataIndex: "turnover", key: "turnover" },
    { title: "Total Traded Qty", dataIndex: "ttq", key: "ttq" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <img
          src={Delete}
          alt="delete"
          onClick={() => handleRemoveStock(record.symbol)}
          style={{ width: "1.3rem", cursor: "pointer" }}
        />
      ),
    },
  ];

  return (
    <Card
      style={{
        width: "45%",
        height: "100%",
        marginRight: "2%",
        marginLeft: "2%",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            marginBottom: "3%",
            position: "relative",
          }}
        >
          <Button onClick={() => setShowDropdown(!showDropdown)}>
            <img src={Plus} alt="plus" style={{ width: "1.5rem" }} />
            Watchlist
          </Button>
          {showDropdown && (
            <ul
              style={{
                marginBottom: "1rem",
                padding: "0",
                listStyle: "none",
                position: "absolute",
                top: "100%",
                right: "0",
                backgroundColor: "white",
                border: "1px solid #ccc",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                zIndex: 1,
              }}
            >
              {availableStocks.map((item) => (
                <li
                  key={item}
                  onClick={() => handleAddStock(item)}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                  }}
                >
                  {getStockName(item)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={data.filter((item) =>
            visibleStocks.includes(item.symbol)
          )}
          rowKey={(record) => record.symbol}
          pagination={false}
        />
      </div>
    </Card>
  );
};

export default WebSocketTable;