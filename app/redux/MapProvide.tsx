"use client";
import React, { ReactNode, memo } from "react";
import { Provider } from "react-redux";
import store from "./store";

interface MapProvider {
  children: ReactNode;
}

const MapProperty = ({ children }: MapProvider) => {
  return <Provider store={store}>{children}</Provider>;
};

export default memo(MapProperty);
