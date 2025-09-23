import React from "react";
import FinancialEdit from "../../../features/financial-edit/ui/FinancialEdit";
import FinancialYears from "../../../features/financial-edit/ui/FinancialYears";
import SmartInput from "../../../entities/smartInput/SmartInput";
import { ActionProps, StateProps } from "../model/model";
import { connect } from "react-redux";
import { ApplicationState } from "../../../store";
import { bindActionCreators } from "redux";
import * as FinancialListStore from "../store/store";

type FinancialListProps = StateProps & ActionProps;

const FinancialList = (props: FinancialListProps) => {
  return (
    <div>
      <div>
        <FinancialEdit />
      </div>

      <div>
        <SmartInput
          defaultValue={props.time1}
          onSave={(val) => props.save({ time1: val })}
        />
      </div>

      <div>
        <SmartInput
          defaultValue={props.time2}
          onSave={(val) => props.save({ time2: val })}
        />
      </div>

      <div>{`time1 ${props.time1}`}</div>
      <div>{`time1 ${props.time2}`}</div>
    </div>
  );
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(FinancialListStore.actionCreators, dispatch);
};

export default connect(
  (state: ApplicationState) => state.financialList,
  mapDispatchToProps
)(FinancialList);
