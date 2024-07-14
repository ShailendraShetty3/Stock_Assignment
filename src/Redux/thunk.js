import { createAsyncThunk } from '@reduxjs/toolkit';

export const establishWebSocketConnection = createAsyncThunk(
  'watchlist/establishWebSocketConnection',
  async (_, { dispatch }) => {
    const token = 'abcd'; // Replace with your token if required
    const wsUrl = `ws://localhost:8000/dataWS?token=${token}`;

    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("WebSocket connection established");
      dispatch(message.success('WebSocket connection established'));

      // Dispatch an action to initialize watchlist data in Redux (optional)
      dispatch(updateWebsocketData({ symbol: "NIFTY", data: { ltp: 17500 } })); // Example data
      dispatch(updateWebsocketData({ symbol: "BANKNIFTY", data: { ltp: 40000 } })); // Example data
      dispatch(updateWebsocketData({ symbol: "ASHOKLEY", data: { ltp: 100 } })); // Example data
    };

    websocket.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        if (receivedData.type === 'Data') {
          dispatch(updateWebsocketData(receivedData.data));
        } else {
          console.warn('Unexpected message type:', receivedData.type);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    websocket.onerror = (event) => {
      console.error('WebSocket error:', event);
      dispatch(message.error('WebSocket error'));
    };

    websocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      dispatch(message.info('WebSocket connection closed'));
    };
  }
);
