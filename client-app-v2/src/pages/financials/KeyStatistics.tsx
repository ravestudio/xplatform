import style from "./Financials.module.css";
import React from "react";
import { format } from "date-fns";

interface Props {
  financials: any;
}

function getStatistics(code: string, items: any[]) {
  return items.find((i) => i.code === code);
}

function getCapitalization(sharesOutstanding: number, price: number) {
  let formatter = Intl.NumberFormat("en", { notation: "compact" });

  //return formatter.format((sharesOutstanding + float) * price);
  return formatter.format(sharesOutstanding * price);
}

function getCurrDividendYield(
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
const keyStatistics = (props: Props) => {
  if (!props.financials?.defaultKeyStatistics) return null;

  const sharesOutstanding = props.financials?.defaultKeyStatistics.reduce(
    (a: any, b: any) => a + b.sharesOutstanding.raw,
    0
  );

  const currentStatistics = props.financials
    ? getStatistics(
        props.financials.financialPage,
        props.financials.defaultKeyStatistics
      )
    : undefined;

  return (
    <div className={style.shareStatistics}>
      <div className={style.shareStatisticsItem}>
        <div className={style.shareStatisticsItemName}>ISIN</div>
        <div className={style.shareStatisticsItemValue}>
          {props.financials.isin}
        </div>
      </div>

      <div className={style.shareStatisticsItem}>
        <div className={style.shareStatisticsItemName}>Shares Outstanding</div>
        <div className={style.shareStatisticsItemValue}>
          {new Intl.NumberFormat("en", { notation: "compact" }).format(
            sharesOutstanding
          )}
        </div>
      </div>

      <div className={style.shareStatisticsItem}>
        <div className={style.shareStatisticsItemName}>Float</div>
        <div className={style.shareStatisticsItemValue}>
          {currentStatistics.floatShares.fmt}
        </div>
      </div>

      <div className={style.shareStatisticsItem}>
        <div className={style.shareStatisticsItemName}>Capitalization</div>
        <div className={style.shareStatisticsItemValue}>
          {getCapitalization(sharesOutstanding, props.financials.quote.price)}
        </div>
      </div>

      <div className={style.shareStatisticsItem}>
        <div className={style.shareStatisticsItemName}>
          Current dividend yield
        </div>
        <div className={style.shareStatisticsItemValue}>
          {getCurrDividendYield(
            sharesOutstanding,
            props.financials.quote,
            props.financials.currencies,
            props.financials.cashflowStatementHistory[0].dividendsPaid?.raw,
            props.financials.financialData?.financialCurrency
          )}
        </div>
      </div>

      <div className={style.shareStatisticsItem}>
        <div className={style.shareStatisticsItemName}>Price updated</div>
        <div className={style.shareStatisticsItemValue}>
          {format(
            new Date(props.financials.quote.lastUpdate),
            "dd-MM-yyyy hh:mm"
          )}
        </div>
      </div>
    </div>
  );
};

export default keyStatistics;
