import React, { useRef, useEffect } from "react";

import { EChartsOption } from "echarts";
import { ReactECharts } from "../../shared/ReactECharts";

interface Props {
  financials: any;
}

const IncomesEChart: React.FC<Props> = (props: Props) => {
  const { financials } = props;

  if (!financials) return null;

  const options: EChartsOption = {
    title: {
      text: "Annual revenue and earnings",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      top: "bottom",
    },
    grid: {
      left: 80,
      right: 0,
    },
    xAxis: {
      type: "category",
      data: props.financials?.years.slice().reverse(),
    },
    yAxis: {
      name: "USD in thosands",
      type: "value",
      axisLabel: {
        formatter: function (a) {
          return new Intl.NumberFormat("en", { notation: "compact" }).format(a);
        },
      },
    },
    series: [
      {
        name: "Revenue",
        color: "#91cc75",
        //color: "#5470c6",
        barGap: 0,
        data: props.financials.incomeStatementHistory
          .slice()
          .reverse()
          .map((inc: any) => inc.totalRevenue.raw / 1000),
        type: "bar",
      },
      {
        name: "Earnings",
        color: "#5470c6",
        //color: "#91cc75",
        data: props.financials.incomeStatementHistory
          .slice()
          .reverse()
          .map((inc: any) => inc.netIncome.raw / 1000),
        type: "bar",
      },
    ],
  };

  return <ReactECharts option={options} style={{ height: 400 }} />;
};

export default IncomesEChart;
