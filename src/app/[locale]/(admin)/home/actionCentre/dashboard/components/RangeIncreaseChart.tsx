import { LineChart, Line } from '@mui/x-charts';

export default function RangeIncreaseChart({ data }) {
  const chartData = data.map(item => ({
    name: item.vin,
    Monthly: item.rangeIncreaseMonthly,
    Yearly: item.rangeIncreaseYearly,
    Lifetime: item.rangeIncreaseLifetimeEstimate,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Monthly" stroke="#8884d8" />
        <Line type="monotone" dataKey="Yearly" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Lifetime" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );
}
