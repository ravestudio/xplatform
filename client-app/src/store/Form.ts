import { Action, Reducer } from "redux";

export const reducer: Reducer<any> = (
  state: any,
  incomingAction: Action
): any => {
  switch (incomingAction.type) {
    default:
      return state;
  }
};
