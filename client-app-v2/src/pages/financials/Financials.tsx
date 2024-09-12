import React from "react";
import { connect } from "react-redux";

import { ApplicationState } from "../../store";
import * as FinancialsStore from "../../store/Financials";
import style from "./Financials.module.css";

import Tabs, { Tab } from "../../components/tabs";
import { useParams } from "react-router";
import IncomesChart from "./IncomesChart";
import IncomesEChart from "./IncomesEChart";
import IncomesTable from "./IncomesTable";
import FlowsTable from "./FlowsTable";
import BalanceTable from "./BalanceTable";
import KeyStatistics from "./KeyStatistics";
import NoteListConnected from "./ui/NoteListConnected";

interface IParams {
  params: any;
}

type FinancialsProps = FinancialsStore.FinancialsState &
  typeof FinancialsStore.actionCreators &
  IParams;

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

function withRouter(Component: any) {
  function ComponentWithRouter(props: any) {
    let params = useParams();
    return <Component {...props} params={params} />;
  }
  return ComponentWithRouter;
}

class Financials extends React.PureComponent<FinancialsProps, IState> {
  constructor(props: FinancialsProps) {
    super(props);

    this.state = { activeTab: "incomes" };

    this.handleChange = this.handleChange.bind(this);
  }

  public componentDidMount() {
    //const code = this.props.match.params.code;
    const code = this.props.params.code;

    this.props.requestFinancials(code);
  }

  private handleChange(newValue: string) {
    this.setState((state) => ({ ...state, activeTab: newValue }));
  }

  public render() {
    return (
      <React.Fragment>
        {this.props.financials && (
          <h1>{`${this.props.financials.emitent}(${this.props.financials.financialPage})`}</h1>
        )}

        {this.props.financials?.assetProfile && (
          <div className={style.emitentWebsite}>
            <a href={this.props.financials.assetProfile.website}>
              {this.props.financials.assetProfile.website}
            </a>
          </div>
        )}

        <KeyStatistics financials={this.props.financials} />

        <div className="container">
          <div className="container column auto">
            <Tabs value={this.state.activeTab} onSelect={this.handleChange}>
              <Tab
                label="Incomes"
                value="incomes"
                icon="fa-code"
                //onSelect={this.handleChange}
              />
              <Tab
                label="Cash Flow"
                value="cash"
                icon="fa-code"
                //onSelect={this.handleChange}
              />
              <Tab
                label="Balance Sheet"
                value="balance"
                icon="fa-code"
                //onSelect={this.handleChange}
              />
            </Tabs>

            {this.props.isLoading && <span>Loading...</span>}

            {this.props.financials?.financialData && (
              <div>
                Currency in{" "}
                {this.props.financials.financialData.financialCurrency}
              </div>
            )}

            <TabPanel value={this.state.activeTab} index="incomes">
              <IncomesTable financials={this.props.financials} />
            </TabPanel>

            <TabPanel value={this.state.activeTab} index="cash">
              <FlowsTable financials={this.props.financials} />
            </TabPanel>

            <TabPanel value={this.state.activeTab} index="balance">
              <BalanceTable financials={this.props.financials} />
            </TabPanel>

            {this.props.financials?.assetProfile && (
              <div className={style.emitentProfile}>
                <h2>Description</h2>
                <div>
                  {this.props.financials.assetProfile.longBusinessSummary}
                </div>
              </div>
            )}
          </div>

          <div className={style.chart}>
            <IncomesEChart financials={this.props.financials} />
            <NoteListConnected />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(
    (state: ApplicationState) => state.financials,
    FinancialsStore.actionCreators
  )(Financials as any)
);
