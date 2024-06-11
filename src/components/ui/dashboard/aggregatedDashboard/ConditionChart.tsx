"use client"
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ConditionChart = () => {
  const series = [10, 50, 102];

  const options = {
    labels: ['Critical', 'Satisfactory', 'Good'],
    colors: ['#e74c3c', '#f1c40f', '#2ecc71'],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex];
      },
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="pie" width="370" height="auto" />
    </div>
  );
};

export default ConditionChart;
