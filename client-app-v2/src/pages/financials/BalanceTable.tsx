import style from "./Financials.module.css";

import React from "react";

import ValueRenderer from "./ValueRenderer";

interface Props {
  financials: any;
}

function calcLongLiab(bl: any) {
  if (bl.totalLiab && bl.totalCurrentLiabilities) {
    return {
      raw: bl.totalLiab.raw - bl.totalCurrentLiabilities.raw,
    };
  }

  return undefined;
}

const balanceTable = (props: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th className={style.cellHead}>Balance Sheet</th>
          {props.financials?.years.map((year: number) => (
            <th className={style.cellHead} key={year}>
              {year}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Current Liabilities</td>
          {props.financials?.balanceSheetHistory.map(
            (bl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={bl.totalCurrentLiabilities} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Non-Current Liabilities</td>
          {props.financials?.balanceSheetHistory.map(
            (bl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={calcLongLiab(bl)} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Total Liabilities</td>
          {props.financials?.balanceSheetHistory.map(
            (bl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={bl.totalLiab} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Current Assets</td>
          {props.financials?.balanceSheetHistory.map(
            (bl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={bl.totalCurrentAssets} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Total Assets</td>
          {props.financials?.balanceSheetHistory.map(
            (bl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={bl.totalAssets} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Stockholder Equity</td>
          {props.financials?.balanceSheetHistory.map(
            (bl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={bl.totalStockholderEquity} />
              </td>
            )
          )}
        </tr>

        <tr>
          <td>Minority Interest</td>
          {props.financials?.balanceSheetHistory.map(
            (bl: any, index: number) => (
              <td className={style.cell} key={index}>
                <ValueRenderer value={bl.minorityInterest} />
              </td>
            )
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default balanceTable;
