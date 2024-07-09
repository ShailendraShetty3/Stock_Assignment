// src/features/stocks/stocksSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStocks: ["NSE:26000"],
  availableStocks: ["NSE:26009", "NSE:212"],
  stockData: [],
};

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    addStock: (state, action) => {
      const stock = action.payload;
      if (!state.selectedStocks.includes(stock)) {
        state.selectedStocks.push(stock);
        state.availableStocks = state.availableStocks.filter(
          (s) => s !== stock
        );
      }
    },
    removeStock: (state, action) => {
      const stock = action.payload;
      state.selectedStocks = state.selectedStocks.filter((s) => s !== stock);
      if (!state.availableStocks.includes(stock)) {
        state.availableStocks.push(stock);
      }
    },
    updateStockData: (state, action) => {
      const newData = action.payload;
      const index = state.stockData.findIndex(
        (item) => item.symbol === newData.symbol
      );
      if (index !== -1) {
        state.stockData[index] = newData;
      } else {
        state.stockData.push(newData);
      }
    },
  },
});

export const { addStock, removeStock, updateStockData } = stocksSlice.actions;
export default stocksSlice.reducer;
