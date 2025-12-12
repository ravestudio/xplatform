import style from "./Financials.module.css";
import React from "react";

import ValueRenderer from "./ValueRenderer";
import { calcFCF, calcOCF } from "./helpers/helpers";

interface Props {
  financials: any;
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
          <td>Change in Net Working Capital</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={fl.changeInWorkingCapital} />
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

        <tr>
          <td>OCF</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer
                  value={calcOCF(
                    props.financials?.incomeStatementHistory[index],
                    fl
                  )}
                />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>FCF</td>
          {props.financials?.cashflowStatementHistory.map(
            (fl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer
                  value={calcFCF(
                    props.financials?.incomeStatementHistory[index],
                    fl
                  )}
                />
              </td>
            )
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default flowsTable;
