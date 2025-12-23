import { bindActionCreators } from "redux";
import * as DividendListStore from "../store/store";
import { ApplicationState } from "../../../store";
import { StateProps } from "../model/model";

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(DividendListStore.actionCreators, dispatch);
};

export const mapProps = (
  code: string | undefined,
  state: ApplicationState
): StateProps | undefined => {
  return state.dividendList
    ? {
        code: code,
        ...state.dividendList,
      }
    : undefined;
};
