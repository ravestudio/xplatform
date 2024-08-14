import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.scss";
import "./Grid.scss";
import { createBrowserHistory } from "history";
import configureStore from "./store/configureStore";
import App from "./App";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-alpine.css";

// Create browser history to use in the Redux store
const baseUrl = document
  .getElementsByTagName("base")[0]
  .getAttribute("href") as string;
const history = createBrowserHistory();

const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
