import { ThunkAction, Action } from "@reduxjs/toolkit";
//import counterReducer from '../features/counter/counterSlice';
import { createBrowserHistory } from "history";
import { getAuthToken } from "../shared/utils/auth";
import configureStore from "../store/configureStore";

/*export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});*/

const history = createBrowserHistory();

const initial = {
  auth: {
    token: getAuthToken(),
  },
};

export const store = configureStore(history, initial);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
