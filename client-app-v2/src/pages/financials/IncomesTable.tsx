import style from "./Financials.module.css";

import React from "react";

import ValueRenderer from "./ValueRenderer";
import { viewConfig } from "../../entities/financial";

interface Props {
  financials: any;
}

const incomesTable = (props: Props) => {
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
          <td>{viewConfig.totalRevenue}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={inc.totalRevenue} />
              </td>
            )
          )}
        </tr>
        <tr>
          <td>{viewConfig.costOfRevenue}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={inc.costOfRevenue} />
              </td>
            )
          )}
        </tr>
        <tr>
          <td>{viewConfig.totalOperatingExpenses}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={inc.totalOperatingExpenses} />
              </td>
            )
          )}
        </tr>
        <tr>
          <td>{viewConfig.netIncome}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={inc.netIncome} />
              </td>
            )
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default incomesTable;
