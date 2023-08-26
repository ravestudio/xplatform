import React, { useRef, useEffect } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface Props {
  financials: any;
}

const IncomesChart: React.FC<Props> = (props: Props) => {
  const chartComponent = useRef<any>(null);
  const { financials } = props;

  useEffect(() => {
    chartComponent.current?.chart.reflow();
  }, []);

  if (!financials) return null;
  const options = {
    legend: {
      enabled: true,
    },
    chart: {
      type: "column",
      //width: 400,
    },
    title: {
      text: "Annual revenue and earnings",
    },
    xAxis: {
      categories: props.financials?.years.slice().reverse(),
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
    <HighchartsReact
      ref={chartComponent}
      highcharts={Highcharts}
      options={{
        ...options,
        series: [
          {
            name: "Revenue",
            color: "rgba(66,146,40,1)",
            data: props.financials.incomeStatementHistory
              .slice()
              .reverse()
              .map((inc: any) => inc.totalRevenue.raw / 1000),
          },
          {
            name: "Earnings",
            color: "rgba(35,99,165,1)",
            data: props.financials.incomeStatementHistory
              .slice()
              .reverse()
              .map((inc: any) => inc.netIncome.raw / 1000),
          },
        ],
      }}
    />
  );
};

export default IncomesChart;
