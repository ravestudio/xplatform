import React from "react";
import { connect } from "react-redux";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { ApplicationState } from "../../store";
import * as FinancialsStore from "../../store/Financials";
import "./Financials.scss";

import NumberFormat from "react-number-format";
import { compose } from "recompose";
import Tabs, { Tab } from "../tabs";
import { useParams } from "react-router";

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

  private getCapitalization(sharesOutstanding: number, price: number) {
    let formatter = Intl.NumberFormat("en", { notation: "compact" });

    //return formatter.format((sharesOutstanding + float) * price);
    return formatter.format(sharesOutstanding * price);
  }

  private getStatistics(code: string, items: any[]) {
    return items.find((i) => i.code === code);
  }

  private getCurrDividendYield(
    sharesOutstanding: number,
    quote: any,
    currencies: any[],
    divPaid: number | undefined,
    financialCurrency: string | undefined
  ) {
    let currencyCorrection = 1;

    //если цена в рублях
    if (quote.Board === "TQBR") {
      if (financialCurrency === "USD") {
        currencyCorrection = currencies.find(
          (c) => c.symbol === "USD000UTSTOM"
        ).price;
      }
    }

    //если цена в HKD
    if (quote.Board === "SPBHKEX") {
      if (financialCurrency === "CNY") {
        const cny_rub = currencies.find((c) => c.symbol === "CNYRUB_TOM").price;
        const hkd_rub = currencies.find((c) => c.symbol === "HKDRUB_TOM").price;

        currencyCorrection = hkd_rub / cny_rub;
      }
    }

    /*const value = divPaid
      ? ((divPaid * currencyPrice) /
          ((sharesOutstanding + float) * quote.price)) *
        -100
      : 0;*/

    const value = divPaid
      ? ((divPaid * currencyCorrection) / (sharesOutstanding * quote.price)) *
        -100
      : 0;

    return `${value.toFixed(2)}%`;
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

    const sharesOutstanding =
      this.props.financials?.defaultKeyStatistics.reduce(
        (a, b) => a + b.sharesOutstanding.raw,
        0
      );

    const currentStatistics = this.props.financials
      ? this.getStatistics(
          this.props.financials.financialPage,
          this.props.financials.defaultKeyStatistics
        )
      : undefined;

    return (
      <React.Fragment>
        {this.props.financials && (
          <h1>{`${this.props.financials.emitent}(${this.props.financials.financialPage})`}</h1>
        )}

        {this.props.financials?.assetProfile && (
          <div className="emitent-website">
            <a href={this.props.financials.assetProfile.website}>
              {this.props.financials.assetProfile.website}
            </a>
          </div>
        )}

        {this.props.financials?.defaultKeyStatistics && (
          <div className="share-statistics">
            <div className="share-statistics-item">
              <div className="share-statistics-item-name">ISIN</div>
              <div className="share-statistics-item-value">
                {this.props.financials.isin}
              </div>
            </div>

            <div className="share-statistics-item">
              <div className="share-statistics-item-name">
                Shares Outstanding
              </div>
              <div className="share-statistics-item-value">
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  sharesOutstanding
                )}
              </div>
            </div>

            <div className="share-statistics-item">
              <div className="share-statistics-item-name">Float</div>
              <div className="share-statistics-item-value">
                {currentStatistics.floatShares.fmt}
              </div>
            </div>

            <div className="share-statistics-item">
              <div className="share-statistics-item-name">Capitalization</div>
              <div className="share-statistics-item-value">
                {this.getCapitalization(
                  sharesOutstanding,
                  this.props.financials.quote.price
                )}
              </div>
            </div>

            <div className="share-statistics-item">
              <div className="share-statistics-item-name">
                Current dividend yield
              </div>
              <div className="share-statistics-item-value">
                {this.getCurrDividendYield(
                  sharesOutstanding,
                  this.props.financials.quote,
                  this.props.financials.currencies,
                  this.props.financials.cashflowStatementHistory[0]
                    .dividendsPaid?.raw,
                  this.props.financials.financialData?.financialCurrency
                )}
              </div>
            </div>
          </div>
        )}

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
            Currency in {this.props.financials.financialData.financialCurrency}
          </div>
        )}

        <TabPanel value={this.state.activeTab} index="incomes">
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

        <TabPanel value={this.state.activeTab} index="cash">
          {this.renderFlowsTable()}
        </TabPanel>

        <TabPanel value={this.state.activeTab} index="balance">
          {this.renderBalanceSheet()}
        </TabPanel>

        {this.props.financials?.assetProfile && (
          <div className="emitent-profile">
            <h2>Description</h2>
            <div>{this.props.financials.assetProfile.longBusinessSummary}</div>
          </div>
        )}
      </React.Fragment>
    );
  }

  private renderFlowsTable() {
    return (
      <table>
        <thead>
          <tr>
            <th className="cellHead">Breakdown</th>
            {this.props.financials?.years.map((year: number) => (
              <th className="cellHead" key={year}>
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
                <td className="cell" key={index}>
                  {this.RenderValue(fl.depreciation)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Flows from investing activities</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(fl.totalCashflowsFromInvestingActivities)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Capital expenditures</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(fl.capitalExpenditures)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>NWC</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(this.CalcNWC(fl))}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Repurchase Of Stock</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(fl.repurchaseOfStock)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Dividends Paid</td>
            {this.props.financials?.cashflowStatementHistory.map(
              (fl: any, index: number) => (
                <td className="cell" key={index}>
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
            <th className="cellHead">Breakdown</th>
            {this.props.financials?.years.map((year: number) => (
              <th className="cellHead" key={year}>
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
                <td className="cell" key={index}>
                  {this.RenderValue(inc.totalRevenue)}
                </td>
              )
            )}
          </tr>
          <tr>
            <td>Cost of Revenue</td>
            {this.props.financials?.incomeStatementHistory.map(
              (inc: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(inc.costOfRevenue)}
                </td>
              )
            )}
          </tr>
          <tr>
            <td>Total Operating Expenses</td>
            {this.props.financials?.incomeStatementHistory.map(
              (inc: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(inc.totalOperatingExpenses)}
                </td>
              )
            )}
          </tr>
          <tr>
            <td>Net Income</td>
            {this.props.financials?.incomeStatementHistory.map(
              (inc: any, index: number) => (
                <td className="cell" key={index}>
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
            <th className="cellHead">Balance Sheet</th>
            {this.props.financials?.years.map((year: number) => (
              <th className="cellHead" key={year}>
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
                <td className="cell" key={index}>
                  {this.RenderValue(bl.totalCurrentLiabilities)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Non-Current Liabilities</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(this.CalcLongLiab(bl))}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Total Liabilities</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(bl.totalLiab)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Current Assets</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(bl.totalCurrentAssets)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Total Assets</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className="cell" key={index}>
                  {this.RenderValue(bl.totalAssets)}
                </td>
              )
            )}
          </tr>

          <tr>
            <td>Stockholder Equity</td>
            {this.props.financials?.balanceSheetHistory.map(
              (bl: any, index: number) => (
                <td className="cell" key={index}>
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
  withRouter,
  connect(
    (state: ApplicationState) => state.financials,
    FinancialsStore.actionCreators
  )
)(Financials as any);
