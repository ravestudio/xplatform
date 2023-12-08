import { AppThunkAction } from "../../../store";

//type KnownAction = {};

export const actionCreators = {
  addNote:
    (data: any): AppThunkAction<any> =>
    (dispath, getState) => {
      const appState = getState();

      return fetch(`/api/notes/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: appState.auth?.token as string,
        },
        body: JSON.stringify(data),
      });
    },
};
