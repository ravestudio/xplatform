import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as EmitentsStore from "../../store/Emitents";
import * as SecuritiesStore from "../../store/Securities";
import * as SystemStore from "../../store/System";
import Tabs, { Tab } from "../tabs";
import Securities from "./Securities";
import System from "./System";
import Emitents from "./Emitents";

const mapDispatchToProps = (dispatch: any) => {
  return {
    emitentActions: bindActionCreators(EmitentsStore.actionCreators, dispatch),
    secActions: bindActionCreators(SecuritiesStore.actionCreators, dispatch),
    sysActions: bindActionCreators(SystemStore.actionCreators, dispatch),
  };
};

type AdminProps = ReturnType<typeof mapDispatchToProps>;

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
    this.props.emitentActions.requestEmitents();
    this.props.secActions.requestSecurities();
    //this.props.sysActions.requestData();
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
            label="Emitents"
            value="emitents"
            icon="fa-code"
            //onSelect={this.handleChange}
          />
          <Tab
            label="Securities"
            value="securities"
            icon="fa-code"
            //onSelect={this.handleChange}
          />
          <Tab
            label="System"
            value="system"
            icon="fa-code"
            //onSelect={this.handleChange}
          />
        </Tabs>

        <TabPanel value={this.state.activeTab} index="emitents">
          <Emitents />
        </TabPanel>

        <TabPanel value={this.state.activeTab} index="securities">
          <Securities />
        </TabPanel>
        <TabPanel value={this.state.activeTab} index="system">
          <System />
        </TabPanel>
      </React.Fragment>
    );
  }
}

export default connect(null, mapDispatchToProps)(Admin);
