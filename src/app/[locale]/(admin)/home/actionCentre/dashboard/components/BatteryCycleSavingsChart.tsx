import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from '@mui/x-charts';

export default function BatteryCycleSavingsChart({ data }) {
  const chartData = data.map(item => ({
    name: item.vin,
    Monthly: item.batteryCycleSavingMonthly,
    Yearly: item.batteryCycleSavingYearly,
    Lifetime: item.batteryCycleSavingLifetime,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Monthly" fill="#8884d8" />
        <Bar dataKey="Yearly" fill="#82ca9d" />
        <Bar dataKey="Lifetime" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
}
