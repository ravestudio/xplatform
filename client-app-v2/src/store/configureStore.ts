import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { History } from "history";
import { ApplicationState, reducers } from "./";
import { configureStore as config } from "@reduxjs/toolkit";

export default function configureStore(history: History, initialState?: any) {
  //const middleware = [thunk];

  const enhancers = [];
  const windowIfDefined =
    typeof window === "undefined" ? null : (window as any);
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }

  const rootReducer = combineReducers({
    ...reducers,
  });

  /*return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );*/

  return config({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    reducer: rootReducer,
    preloadedState: initialState,
  });
}
