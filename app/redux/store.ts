import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./root_reducer";

const store = configureStore({
  reducer: rootReducer,
  // Enable devTools only in development
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: process.env.NODE_ENV !== "production",
      immutableCheck: process.env.NODE_ENV !== "production",
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
