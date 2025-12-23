import * as DividendListStore from "../store/store";

export type StateProps = {
  code?: string;
} & DividendListStore.DividendListState;

export type ActionProps = typeof DividendListStore.actionCreators;