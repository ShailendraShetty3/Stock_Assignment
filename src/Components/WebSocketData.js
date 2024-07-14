// src/useWebSocket.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStockData } from '../Redux/stocksSlice'; // Adjust the path as necessary

const useWebSocket = (wsUrl) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.watchlist);
  const stockData = useSelector((state) => state.watchlist.stockData);
  const wsRef = useRef(null);

  useEffect(() => {
    const websocket = new WebSocket(wsUrl);
    wsRef.current = websocket;

    websocket.onopen = () => {
      console.log("WebSocket connection established");
      // Send subscription messages for all stocks in the watchlist
      watchlist.forEach(stock => {
        const subscriptionMessage = JSON.stringify({ action: 'subscribe', tokens: [stock] });
        websocket.send(subscriptionMessage);
        console.log("Subscription message sent:", subscriptionMessage);
      });
    };

    websocket.onmessage = (event) => {
      const { stock, data } = JSON.parse(event.data);
      dispatch(updateStockData({ stock, data }));
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      websocket.close();
    };
  }, [wsUrl, watchlist, dispatch]);

  // Handle subscriptions and unsubscriptions
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const newlyAddedStocks = watchlist.filter(
        (stock) => !Object.keys(stockData).includes(stock)
      );

      newlyAddedStocks.forEach((stock) => {
        const subscriptionMessage = JSON.stringify({ action: 'subscribe', tokens: [stock] });
        wsRef.current.send(subscriptionMessage);
        console.log("Subscription message sent:", subscriptionMessage);
      });

      const removedStocks = Object.keys(stockData).filter(
        (stock) => !watchlist.includes(stock)
      );

      removedStocks.forEach((stock) => {
        const unsubscriptionMessage = JSON.stringify({ action: 'unsubscribe', tokens: [stock] });
        wsRef.current.send(unsubscriptionMessage);
        console.log("Unsubscription message sent:", unsubscriptionMessage);
      });
    }
  }, [watchlist, stockData]);

  return null;
};

export default useWebSocket;
