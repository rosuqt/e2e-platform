import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface EChartsAnalyticsProps {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
}

const EChartsAnalytics: React.FC<EChartsAnalyticsProps> = ({ option, style }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: echarts.ECharts | undefined;
    if (chartRef.current) {
      chart = echarts.init(chartRef.current);
      chart.setOption(option);
    }
    return () => {
      chart?.dispose();
    };
  }, [option]);

  return <div ref={chartRef} style={{ width: "100%", height: 400, ...style }} />;
};

export default EChartsAnalytics;
