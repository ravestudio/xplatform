import { bindActionCreators } from "redux";
import * as NoteListStore from "../store/store";
import { ApplicationState } from "../../../store";
import { StateProps } from "../model/model";
//import { unloadedState } from "../store/store";

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(NoteListStore.actionCreators, dispatch);
};

export const mapProps = (
  code: string | undefined,
  state: ApplicationState
): StateProps | undefined => {
  return state.noteList
    ? {
        code: code,
        ...state.noteList,
      }
    : undefined;
};
