import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from '@mui/x-charts';

export default function CostSavingsChart({ data }) {
    const chartData = data.map(item => ({
      name: item.vin,
      Monthly: item.costSavingChargingMonthly,
      Yearly: item.costSavingChargingYearly,
      Lifetime: item.costSavingChargingLifeTimeEstimate,
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
  