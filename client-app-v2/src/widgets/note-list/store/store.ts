import { Action, Reducer } from "redux";
import { AppThunkAction } from "../../../store";
import { Note } from "../../../entities/note";
import { v4 } from "uuid";

export interface NoteListState {
  isLoading: boolean;
  notes: Note[];
  requestId?: string;
}

interface RequestNotesAction {
  type: "NOTES_REQUEST";
  requestId: string;
}

interface ReceiveNotesAction {
  type: "NOTES_RECEIVE";
  notes: Note[];
}

interface ResetAction {
  type: "NOTES_RESET";
}

type KnownAction = RequestNotesAction | ReceiveNotesAction | ResetAction;

export const actionCreators = {
  requestNotes:
    (code: string): AppThunkAction<KnownAction> =>
    (dispatch, getState) => {
      const appState = getState();

      if (appState.noteList?.requestId === undefined) {
        fetch(`/api/notes/?code=${code}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: appState.auth?.token as string,
          },
        })
          .then((response) => response.json() as Promise<Note[]>)
          .then((data) => {
            dispatch({ type: "NOTES_RECEIVE", notes: data });
          });

        dispatch({
          type: "NOTES_REQUEST",
          requestId: v4(),
        });
      }
    },

  reset: () => ({ type: "NOTES_RESET" }),
};

export const unloadedState: NoteListState = {
  notes: [],
  isLoading: false,
};

export const reducer: Reducer<NoteListState> = (
  state: NoteListState | undefined,
  incomingAction: Action
): NoteListState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "NOTES_REQUEST":
      return { ...state, isLoading: true, requestId: action.requestId };

    case "NOTES_RECEIVE":
      return { ...state, notes: action.notes, isLoading: false };

    case "NOTES_RESET":
      return unloadedState;

    default:
      return state;
  }
};
