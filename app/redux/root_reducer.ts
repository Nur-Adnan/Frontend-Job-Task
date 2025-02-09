import { combineReducers } from "@reduxjs/toolkit";
import mapReducer from "./features/map/reducer";

// To hold all reducers
const reducers = {
  mapData: mapReducer,
};
const rootReducer = combineReducers(reducers);
export type RootState = ReturnType<typeof rootReducer>;
export type ReducerMap = typeof reducers;

export default rootReducer;
