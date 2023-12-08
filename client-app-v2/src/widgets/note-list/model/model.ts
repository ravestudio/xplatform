import * as NoteListStore from "../store/store";
//import { mapDispatchToProps, mapProps } from "../utils/utils";

//export type StateProps = ReturnType<typeof mapProps>;
export type StateProps = {
  code?: string;
} & NoteListStore.NoteListState;

export type ActionProps = typeof NoteListStore.actionCreators;
