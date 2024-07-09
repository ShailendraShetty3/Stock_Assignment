// import React, { useEffect, useState } from "react";
// import { Table, message, Card, Button } from "antd";
// import Plus from "../Images/plusIcon.png";
// import Delete from "../Images/deleteIcon.png";


// ///
// import { useDispatch, useSelector } from "react-redux";
// import { addStock, removeStock } from "../Redux/stocksSlice";

// const WebSocketTable = () => {
//     const dispatch = useDispatch();



//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [visibleStocks, setVisibleStocks] = useState(["NSE:26000"]); // Initially only NIFTY is visible
//   const [availableStocks, setAvailableStocks] = useState(["NSE:26009", "NSE:212"]); // Available stocks to add
//   const [showDropdown, setShowDropdown] = useState(false);

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
//           setData((prevData) => {
//             const index = prevData.findIndex(
//               (item) => item.symbol === receivedData.data.symbol
//             );
//             if (index !== -1) {
//               // Update existing row
//               const newData = [...prevData];
//               newData[index] = receivedData.data;
//               return newData;
//             } else {
//               // Add new row
//               return [...prevData, receivedData.data];
//             }
//           });
//         } else {
//           console.warn("Unexpected message type:", receivedData.type);
//         }
//       } catch (err) {
//         console.error("Error parsing WebSocket message:", err);
//         setError("Error parsing WebSocket message");
//       }
//     };

//     ws.onerror = (event) => {
//       console.error("WebSocket error:", event);
//       setError("WebSocket error");
//       message.error("WebSocket error");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket connection closed");
//       message.info("WebSocket connection closed");
//     };

//     // Clean up WebSocket connection
//     return () => {
//       ws.close();
//     };
//   }, []); // Empty dependency array ensures effect runs only on mount

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

//   const handleRemoveStock = (stock) => {
//     setVisibleStocks(visibleStocks.filter((s) => s !== stock));
//       setAvailableStocks([...availableStocks, stock]);
      

//       dispatch(removeStock(stock));
//   };

//   const columns = [
//     {
//       title: "Stock Name",
//       dataIndex: "symbol",
//       key: "stock_name",
//       render: (text) => getStockName(text),
//     },
//     { title: "Timestamp", dataIndex: "timestamp_str", key: "timestamp_str" },
//     { title: "Symbol", dataIndex: "symbol", key: "symbol" },
//     { title: "LTP", dataIndex: "ltp", key: "ltp" },
//     { title: "Turnover", dataIndex: "turnover", key: "turnover" },
//     { title: "Total Traded Qty", dataIndex: "ttq", key: "ttq" },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         //   <Button onClick={() => handleRemoveStock(record.symbol)}>Remove</Button>
//           <img src={Delete} alt="delete" onClick={() => handleRemoveStock(record.symbol)}
//               style={{width:"1.3rem"}}
//           />
//       ),
//     },
//   ];

//   const handleAddStock = (stock) => {
//     setVisibleStocks([...visibleStocks, stock]);
//     setAvailableStocks(availableStocks.filter((s) => s !== stock));
//       setShowDropdown(false); // Hide the dropdown after adding a stock
      
//       dispatch(addStock(stock));
//   };

//   return (
//     <Card
//       style={{
//         width: "45%",
//         height: "100%",
//         marginRight: "2%",
//         marginLeft: "2%",
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           display: "flex",
//           justifyContent: "end",
//           marginBottom: "3%",
//           position: "relative",
//         }}
//       >
//         <Button onClick={() => setShowDropdown(!showDropdown)}>
//           <img src={Plus} alt="plus" style={{ width: "1.5rem" }} />
//           Watchlist
//         </Button>
//         {showDropdown && (
//           <ul
//             style={{
//               marginBottom: "1rem",
//               padding: "0",
//               listStyle: "none",
//               position: "absolute",
//               top: "100%",
//               right: "0",
//               backgroundColor: "white",
//               border: "1px solid #ccc",
//               boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
//               zIndex: 1,
//             }}
//           >
//             {availableStocks.map((item) => (
//               <li
//                 key={item}
//                 onClick={() => handleAddStock(item)}
//                 style={{
//                   cursor: "pointer",
//                   padding: "5px 10px",
//                 }}
//               >
//                 {getStockName(item)}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <Table
//         columns={columns}
//         dataSource={data.filter((item) => visibleStocks.includes(item.symbol))}
//         rowKey={(record) => record.symbol}
//         pagination={false}
//       />
//     </Card>
//   );
// };

// export default WebSocketTable;








import React, { useEffect, useState } from "react";
import { Table, message, Card, Button } from "antd";
import Plus from "../Images/plusIcon.png";
import Delete from "../Images/deleteIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { addStock, removeStock } from "../Redux/stocksSlice";

const WebSocketTable = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [visibleStocks, setVisibleStocks] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load selected stocks from local storage on initial mount
  useEffect(() => {
    const savedSelectedStocks = JSON.parse(localStorage.getItem("selectedStocks")) || [];
    setVisibleStocks(savedSelectedStocks);
  }, []);

  // Save selected stocks to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedStocks", JSON.stringify(visibleStocks));
  }, [visibleStocks]);

  // Initialize available stocks based on predefined options
  useEffect(() => {
    const initialAvailableStocks = ["NSE:26000", "NSE:26009", "NSE:212"].filter(
      (stock) => !visibleStocks.includes(stock)
    );
    setAvailableStocks(initialAvailableStocks);
  }, [visibleStocks]);

  // WebSocket connection setup
  useEffect(() => {
    const token = "abcd"; // Replace with your token if required
    const wsUrl = `ws://localhost:8000/dataWS?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      message.success("WebSocket connection established");

      // Send subscription message for all visible tokens
      const subscriptionMessage = JSON.stringify({
        action: "subscribe",
        tokens: visibleStocks,
      });
      ws.send(subscriptionMessage);
      console.log("Subscription message sent:", subscriptionMessage);
    };

    ws.onmessage = (event) => {
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

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket error");
      message.error("WebSocket error");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      message.info("WebSocket connection closed");
    };

    // Clean up WebSocket connection
    return () => {
      ws.close();
    };
  }, [visibleStocks]); // Update subscriptions whenever visibleStocks change

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
    setVisibleStocks(visibleStocks.filter((s) => s !== stock));
    setAvailableStocks([...availableStocks, stock]);
    dispatch(removeStock(stock));
  };

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

  const handleAddStock = (stock) => {
    setVisibleStocks([...visibleStocks, stock]);
    setAvailableStocks(availableStocks.filter((s) => s !== stock));
    setShowDropdown(false); // Hide the dropdown after adding a stock
    dispatch(addStock(stock));
  };

  return (
    <Card
      style={{
        width: "45%",
        height: "100%",
        marginRight: "2%",
        marginLeft: "2%",
      }}
    >
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
        dataSource={data.filter((item) => visibleStocks.includes(item.symbol))}
        rowKey={(record) => record.symbol}
        pagination={false}
      />
    </Card>
  );
};

export default WebSocketTable;
