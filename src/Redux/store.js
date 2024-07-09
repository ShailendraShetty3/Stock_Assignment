// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import stocksReducer from "./stocksSlice";

const store = configureStore({
  reducer: {
    stocks: stocksReducer,
  },
});

export default store;

//this functionality is not yet implemented completely
