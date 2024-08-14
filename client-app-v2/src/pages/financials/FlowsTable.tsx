import style from "./Financials.module.css";
import React from "react";

import ValueRenderer from "./ValueRenderer";

interface Props {
  financials: any;
}

function calcNWC(fl: any) {
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

const flowsTable = (props: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th className={style.cellHead}>Breakdown</th>
          {props.financials?.years.map((year: number) => (
            <th className={style.cellHead} key={year}>
              {year}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Depreciation</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={fl.depreciation} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Flows from investing activities</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer
                  value={fl.totalCashflowsFromInvestingActivities}
                />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Capital expenditures</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={fl.capitalExpenditures} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>NWC</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={calcNWC(fl)} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Repurchase Of Stock</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={fl.repurchaseOfStock} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Dividends Paid</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={fl.dividendsPaid} />
              </td>
            )
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default flowsTable;
