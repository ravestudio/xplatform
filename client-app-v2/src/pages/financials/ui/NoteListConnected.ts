import { connect } from "react-redux";
import { ApplicationState } from "../../../store";

import {
  NoteList,
  mapDispatchToProps,
  mapProps,
} from "../../../widgets/note-list";

export default connect(
  (state: ApplicationState) => mapProps(state.financials?.code, state),
  mapDispatchToProps
)(NoteList);
