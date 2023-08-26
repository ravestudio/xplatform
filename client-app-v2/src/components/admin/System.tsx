import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import * as SystemStore from "../../store/System";

type SystemProps = SystemStore.SystemState;

const System: React.FC<SystemProps> = (props: SystemProps) => {
  const { temperature } = props;
  return <div>{`temperature ${temperature?.t}'${temperature?.unit}`}</div>;
};

export default connect((state: ApplicationState) => state.system)(System);
