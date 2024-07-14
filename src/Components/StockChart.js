// StockChart.js
// import React, { useEffect, useRef } from "react";
// import { createChart } from "lightweight-charts";

// const StockChart = ({ data }) => {
//   const chartContainerRef = useRef();

//   useEffect(() => {
//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth,
//       height: chartContainerRef.current.clientHeight,
//     });

//     const candlestickSeries = chart.addCandlestickSeries();

//     // Convert data to the required format for Lightweight Charts
//     const chartData = data.map((item) => ({
//       time: new Date(item.timestamp_str).getTime() / 1000,
//       open: item.open,
//       high: item.high,
//       low: item.low,
//       close: item.close,
//     }));

//     candlestickSeries.setData(chartData);

//     return () => chart.remove();
//   }, [data]);

//   return <div ref={chartContainerRef} style={{ height: "500px" }} />;
// };

// export default StockChart;









