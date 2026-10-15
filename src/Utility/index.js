import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";
import { DataProvider } from "./Components/DataProvider/DataProvider";
import { initialState, reducer } from "./Components/Reducer/Reducer";



const root = ReactDom.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <DataProvider reducer={reducer} initialState={initialState}>
    <App />
  
  </DataProvider>
  </React.StrictMode>
);