import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from '@mui/x-charts';

export default function DegradationChart({ data }) {
    const chartData = data.map(item => ({
      name: item.vin,
      InitialSoH: item.initialSoH,
      Estimated: item.estimatedDegradation,
      Actual: item.actualDegradation,
      Difference: item.difference,
    }));
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="InitialSoH" fill="#8884d8" />
          <Bar dataKey="Estimated" fill="#82ca9d" />
          <Bar dataKey="Actual" fill="#ffc658" />
          <Bar dataKey="Difference" fill="#ff8042" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  