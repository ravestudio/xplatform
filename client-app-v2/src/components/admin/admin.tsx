import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { ApplicationState } from "../../store";
import * as SecuritiesStore from "../../store/Securities";
import Tabs, { Tab } from "../tabs";
import Securities from "./Securities";

type AdminProps = SecuritiesStore.SecuritiesState &
  typeof SecuritiesStore.actionCreators;

interface IState {
  activeTab: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

class Admin extends React.PureComponent<AdminProps, IState> {
  constructor(props: AdminProps) {
    super(props);

    this.state = { activeTab: "securities" };
    this.handleChange = this.handleChange.bind(this);
  }

  public componentDidMount() {
    this.props.requestSecurities();
  }

  private handleChange(newValue: string) {
    this.setState((state) => ({ ...state, activeTab: newValue }));
  }

  public render() {
    return (
      <React.Fragment>
        <h1>Admin</h1>

        <Tabs value={this.state.activeTab} onSelect={this.handleChange}>
          <Tab
            label="Securities"
            value="securities"
            icon="fa-code"
            //onSelect={this.handleChange}
          />
          <Tab
            label="Profile"
            value="profile"
            icon="fa-code"
            //onSelect={this.handleChange}
          />
        </Tabs>

        <TabPanel value={this.state.activeTab} index="securities">
          <Securities />
        </TabPanel>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(SecuritiesStore.actionCreators, dispatch);
};

export default connect(
  (state: ApplicationState) => state.securities,
  mapDispatchToProps
)(Admin);
