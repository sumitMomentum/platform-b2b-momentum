import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number, numOfDays: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const days = [];
  let i = 1;
  while (days.length < numOfDays) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function SavingsOverTimeChart({ savingsData = [] }: { savingsData?: number[] }) {
  const theme = useTheme();
  const daysInMonth = 30; // For April, we have 30 days
  const data = getDaysInMonth(4, 2024, daysInMonth); // Adjusted to have 30 days for April

  // Updated color palette with green shades
  const colorPalette = [
    theme.palette.success.light,  // Light green
    theme.palette.success.main,   // Medium green
    theme.palette.success.dark,   // Dark green
  ];

  // Sample savings data for 30 days (adjusting for correct length)
  const sampleSavingsData = [
    120, 150, 130, 170, 180, 220, 250, 300, 400, 350, 450, 500, 
    600, 550, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 
    1150, 1200, 1250, 1300, 1350, 1400
  ];

  // Calculate total and average savings
  const totalSavings = sampleSavingsData.reduce((acc, val) => acc + val, 0);
  const averageSavings = totalSavings / sampleSavingsData.length;

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Savings Over Time
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalSavings.toFixed(2)} USD
            </Typography>
            <Chip size="small" color="success" label={`+${Math.round(averageSavings)}%`} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Total savings per day for the last 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[{
            scaleType: 'point',
            data,
            tickInterval: (index, i) => (i + 1) % 5 === 0,
          }]}
          series={[{
            id: 'savings',
            label: 'Savings',
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
            data: sampleSavingsData, // Use the sample savings data
          }]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-savings': {
              fill: "url('#savings')",  // Apply the green gradient
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.success.dark} id="savings" /> {/* Green gradient */}
        </LineChart>
      </CardContent>
    </Card>
  );
}
