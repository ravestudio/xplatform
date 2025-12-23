import { connect } from "react-redux";
import { ApplicationState } from "../../../store";

import {
  DividendList,
  mapDispatchToProps,
  mapProps,
} from "../../../widgets/dividend-list";

export default connect(
  (state: ApplicationState) => mapProps(state.financials?.code, state),
  mapDispatchToProps
)(DividendList);
