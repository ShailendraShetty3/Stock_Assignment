import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  visibleStocks: [],
  // websocketData: {},
  websocketData: "",
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addStock: (state, action) => {
      if (!state.visibleStocks.includes(action.payload)) {
        state.visibleStocks.push(action.payload);
        // Update localStorage after adding stock
        localStorage.setItem('visibleStocks', JSON.stringify(state.visibleStocks));
      }
    },
    removeStock: (state, action) => {
      const index = state.visibleStocks.indexOf(action.payload);
      if (index !== -1) {
        state.visibleStocks.splice(index, 1);
        // Update localStorage after removing stock
        localStorage.setItem('visibleStocks', JSON.stringify(state.visibleStocks));
      }
    },
    // updateWebsocketData: (state, action) => {
    //   console.log("in the stock slice")
    //   console.log(action.payload)
    //   const { symbol, data } = action.payload;
    //   state.websocketData[symbol] = state.websocketData[symbol] || [];
    //   state.websocketData[symbol].push(data);
    // },

    
    updateWebsocketData: (state, action) => {
      console.log("in the stock slice")
      console.log(action.payload)
      state.websocketData = action.payload; // Directly set websocketData to payload
    },
  },
});

// Load visibleStocks from localStorage on initial load
const persistedStocks = localStorage.getItem('visibleStocks');
if (persistedStocks) {
  initialState.visibleStocks = JSON.parse(persistedStocks);
}

export const watchlistReducer = watchlistSlice.reducer;
export const { addStock, removeStock, updateWebsocketData } = watchlistSlice.actions;
