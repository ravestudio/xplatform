import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { ApplicationState } from "../../store";
import * as FinancialsStore from "../../store/Financials";

import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@mui/material/styles";

import NumberFormat from "react-number-format";
import { compose } from "recompose";

const styles = (theme: Theme) =>
  createStyles({
    cellHead: {
      padding: 10,
    },
    cell: {
      padding: 10,
      textAlign: "right",
    },
  });

type FinancialsProps = FinancialsStore.FinancialsState &
  typeof FinancialsStore.actionCreators &
  WithStyles<typeof styles> &
  RouteComponentProps<{ code: string }>;

interface IState {
  activeTab: number;
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

class Financials extends React.PureComponent<FinancialsProps, IState> {
  constructor(props: FinancialsProps) {
    super(props);

    this.state = { activeTab: 0 };

    this.handleChange = this.handleChange.bind(this);
  }

  public componentDidMount() {
    const code = this.props.match.params.code;
    this.props.requestFinancials(code);
  }

  private handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    this.setState((state) => ({ ...state, activeTab: newValue }));
  }

  private CalcNWC(fl: any) {
    if (
      fl.changeToLiabilities &&
      fl.changeToInventory &&
      fl.changeToAccountReceivables &&
      fl.changeToOperatingActivities
    ) {
      return {
        raw:
          fl.changeToLiabilities.raw +
          fl.changeToInventory.raw +
          fl.changeToAccountReceivables.raw +
          fl.changeToOperatingActivities.raw,
      };
    }

    return undefined;
  }

  private CalcLongLiab(bl: any) {
    if (bl.totalLiab && bl.totalCurrentLiabilities) {
      return {
        raw: bl.totalLiab.raw - bl.totalCurrentLiabilities.raw,
      };
    }

    return undefined;
  }

  private RenderValue2(obj: any) {
    return obj ? obj.raw : "-";
  }

  private RenderValue(obj: any) {
    return obj ? (
      <NumberFormat
        value={obj.raw / 1000}
        displayType={"text"}
        thousandSeparator={true}
      />
    ) : (
      "-"
    );
  }

  public render() {
    const options = {
      legend: {
        enabled: true,
      },
      chart: {
        type: "column",
        //width: 650,
      },
      title: {
        text: "Annual revenue and earnings",
      },
      xAxis: {
        categories: this.props.financials?.years.slice().reverse(),
        crosshair: true,
      },
      yAxis: {
        title: {
          text: "USD in thosands",
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} $</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointWidth: 20,
          pointInterval: 1,
        },
      },
      series: [
        {
          data: [],
        },
      ],
    };

    return (
      <React.Fragment>
        <h1>Financials</h1>

        <Tabs
          value={this.state.activeTab}
          onChange={this.handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Incomes" />
          <Tab label="Cash Flow" />
          <Tab label="Balance Sheet" />
        </Tabs>

        {this.props.isLoading && <span>Loading...</span>}

        <TabPanel value={this.state.activeTab} index={0}>
          {this.renderIncomesTable()}

          <div className="chart">
            {this.props.financials && (
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...options,
                  series: [
                    {
                      name: "Revenue",
                      color: "rgba(66,146,40,1)",
                      data: this.props.financials.incomeStatementHistory
                        .slice()
                        .reverse()
                        .map((inc: any) => inc.totalRevenue.raw / 1000),
                    },
                    {
                      name: "Earnings",
                      color: "rgba(35,99,165,1)",
                      data: this.props.financials.incomeStatementHistory
                        .slice()
                        .reverse()
                        .map((inc: any) => inc.netIncome.raw / 1000),
                    },
                  ],
                }}
              />
            )}
          </div>
        </TabPanel>

        <TabPanel value={this.state.activeTab} index={1}>
          {this.renderFlowsTable()}
        </TabPanel>

        <TabPanel value={this.state.activeTab} index={2}>
          {this.renderBalanceSheet()}
        </TabPanel>
      </React.Fragment>
    );
  }

  private renderFlowsTable() {
    return (
      <table>
        <thead>
          <tr>
            <th className={this.props.classes.cellHead}>Breakdown</th>
            {this.props.financials?.years.map((year: number) => (
              <th className={this.props.classes.cellHead} key={year}>
                {year}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Depreciation</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(fl.depreciation)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Flows from investing activities</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(fl.totalCashflowsFromInvestingActivities)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Capital expenditures</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(fl.capitalExpenditures)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>NWC</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(this.CalcNWC(fl))}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Repurchase Of Stock</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(fl.repurchaseOfStock)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Dividends Paid</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(fl.dividendsPaid)}
                </td>
              )
            )}
          </tr>
        </tbody>
      </table>
    );
  }

  private renderIncomesTable() {
    return (
      <table>
        <thead>
          <tr>
            <th className={this.props.classes.cellHead}>Breakdown</th>
            {this.props.financials?.years.map((year: number) => (
              <th className={this.props.classes.cellHead} key={year}>
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Revenue</td>
            {this.props.financials?.incomeStatementHistory.map(
              (inc: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(inc.totalRevenue)}
                </td>
              )
            )}
          </tr>
          <tr>
            <td>Cost of Revenue</td>
            {this.props.financials?.incomeStatementHistory.map(
              (inc: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(inc.costOfRevenue)}
                </td>
              )
            )}
          </tr>
          <tr>
            <td>Total Operating Expenses</td>
            {this.props.financials?.incomeStatementHistory.map(
              (inc: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(inc.totalOperatingExpenses)}
                </td>
              )
            )}
          </tr>
          <tr>
            <td>Net Income</td>
            {this.props.financials?.incomeStatementHistory.map(
              (inc: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(inc.netIncome)}
                </td>
              )
            )}
          </tr>
        </tbody>
      </table>
    );
  }

  private renderBalanceSheet() {
    return (
      <table>
        <thead>
          <tr>
            <th className={this.props.classes.cellHead}>Balance Sheet</th>
            {this.props.financials?.years.map((year: number) => (
              <th className={this.props.classes.cellHead} key={year}>
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Current Liabilities</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(bl.totalCurrentLiabilities)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Non-Current Liabilities</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(this.CalcLongLiab(bl))}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Total Liabilities</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(bl.totalLiab)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Current Assets</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(bl.totalCurrentAssets)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Total Assets</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(bl.totalAssets)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Stockholder Equity</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className={this.props.classes.cell} key={index}>
                  {this.RenderValue(bl.totalStockholderEquity)}
                </td>
              )
            )}
          </tr>
        </tbody>
      </table>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    (state: ApplicationState) => state.financials,
    FinancialsStore.actionCreators
  )
)(Financials as any);
