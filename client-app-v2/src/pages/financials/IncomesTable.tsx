import style from "./Financials.module.css";

import React from "react";

import ValueRenderer from "./ValueRenderer";
import { viewConfig } from "../../entities/financial";
import { calcEBITDA, calcGross, calcSGA } from "./helpers";

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
          <td>{viewConfig.grossProfit}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={calcGross(inc)} />
              </td>
            )
          )}
        </tr>
        <tr>
          <td>{viewConfig.sellingGeneralAdministrative}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={calcSGA(inc)} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>{viewConfig.operatingIncome}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={inc.operatingIncome} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>{viewConfig.interestIncome}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={inc.interestIncome} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>{viewConfig.interestExpense}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={inc.interestExpense} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>{viewConfig.incomeTaxExpense}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={inc.incomeTaxExpense} />
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

        <tr>
          <td>{viewConfig.EBITDA}</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer
                  value={calcEBITDA(
                    inc,
                    props.financials?.cashflowStatementHistory[index]
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

export default incomesTable;
