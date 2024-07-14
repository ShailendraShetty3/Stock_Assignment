import { configureStore } from '@reduxjs/toolkit';
import { watchlistReducer } from './stocksSlice'; // Import the reducer

const store = configureStore({
  reducer: {
    watchlist: watchlistReducer, // Add the reducer to the store
  },
});

export default store;
