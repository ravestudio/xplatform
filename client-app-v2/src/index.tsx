import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.scss";
import "./Grid.scss";
import { createBrowserHistory } from "history";
import configureStore from "./store/configureStore";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Shares from "./components/shares/2Shares";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
