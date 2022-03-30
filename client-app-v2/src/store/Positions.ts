import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { v4 } from "uuid";

export interface PositionsState {
  isLoading: boolean;
  accountId?: number;
  positions: Position[];
  positionDetails: PositionDetails[];

  requestId?: string;
  filterId?: string;
}

export interface Position {
  code: string;
  limit: number;
}

export interface PositionDetails {
  account: number;
  code: string;
  date: Date;
  limit: number;
  price: number;
}

interface RequestPositionsAction {
  type: "POSITIONS_REQUEST";
  filterId: string;
}

interface ReceivePositionsAction {
  type: "POSITIONS_RECEIVE";
  positions: Position[];
}

interface RequestDetailsAction {
  type: "DETAILS_REQUEST";
}

interface ReceiveDetailsAction {
  type: "DETAILS_RECEIVE";
  details: PositionDetails[];
}

interface ChangeFilterPositionsAction {
  type: "POSITIONS_CHANGE_FILTER";
  payload: any;
}

type KnownAction =
  | RequestPositionsAction
  | ReceivePositionsAction
  | RequestDetailsAction
  | ReceiveDetailsAction
  | ChangeFilterPositionsAction;

export const actionCreators = {
  changeFilter: (payload: any): KnownAction => ({
    type: "POSITIONS_CHANGE_FILTER",
    payload,
  }),
  requestPositions:
    (accountId?: number): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      if (
        appState.positions?.filterId &&
        appState.positions?.filterId !== appState.positions?.requestId
      ) {
        fetch(`/api/position/get?${accountId ? `accountId=${accountId}` : ""}`)
          .then((response) => response.json() as Promise<Position[]>)
          .then((data) => {
            dispatch({ type: "POSITIONS_RECEIVE", positions: data });
          });

        dispatch({
          type: "POSITIONS_REQUEST",
          filterId: appState.positions?.filterId,
        });
      }
    },

  requestPositionDetails:
    (code: string, accountId?: number): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      fetch(
        `/api/position/getDetails?security=${code}${
          accountId ? `&accountId=${accountId}` : ""
        }`
      )
        .then((response) => response.json() as Promise<PositionDetails[]>)
        .then((data) => {
          dispatch({ type: "DETAILS_RECEIVE", details: data });
        });

      dispatch({ type: "DETAILS_REQUEST" });
    },
};

const unloadedState: PositionsState = {
  positions: [],
  positionDetails: [],
  isLoading: false,
  filterId: v4(),
};

export const reducer: Reducer<PositionsState> = (
  state: PositionsState | undefined,
  incomingAction: Action
): PositionsState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "POSITIONS_REQUEST":
      return { ...state, isLoading: true, requestId: action.filterId };
    case "DETAILS_REQUEST":
      return { ...state, positionDetails: [], isLoading: true };
    case "POSITIONS_RECEIVE":
      return { ...state, positions: action.positions, isLoading: false };
    case "DETAILS_RECEIVE":
      return { ...state, positionDetails: action.details, isLoading: false };
    case "POSITIONS_CHANGE_FILTER":
      return { ...state, ...action.payload, filterId: v4() };

    default:
      return state;
  }
};
