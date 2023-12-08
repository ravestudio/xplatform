import React from "react";

import ValueRenderer from "./ValueRenderer";

interface Props {
  financials: any;
}

const incomesTable = (props: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th className="cellHead">Breakdown</th>
          {props.financials?.years.map((year: number) => (
            <th className="cellHead" key={year}>
              {year}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total Revenue</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className="cell" key={index}>
                <ValueRenderer value={inc.totalRevenue} />
              </td>
            )
          )}
        </tr>
        <tr>
          <td>Cost of Revenue</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className="cell" key={index}>
                <ValueRenderer value={inc.costOfRevenue} />
              </td>
            )
          )}
        </tr>
        <tr>
          <td>Total Operating Expenses</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className="cell" key={index}>
                <ValueRenderer value={inc.totalOperatingExpenses} />
              </td>
            )
          )}
        </tr>
        <tr>
          <td>Net Income</td>
          {props.financials?.incomeStatementHistory.map(
            (inc: any, index: number) => (
              <td className="cell" key={index}>
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
