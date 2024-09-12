import React, { useRef, useEffect } from "react";
import { init, getInstanceByDom } from "echarts";
import type { CSSProperties, FC } from "react";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
}

const ReactECharts: FC<ReactEChartsProps> = (props) => {
  const { option, style, settings, loading, theme } = props;

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }

    const resizeChart = () => {
      chart?.resize();
    };
    window.addEventListener("resize", resizeChart);

    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart?.setOption(option, settings);
    }
  }, [option, settings, theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "300px", ...style }} />
  );
};

export { ReactECharts };
