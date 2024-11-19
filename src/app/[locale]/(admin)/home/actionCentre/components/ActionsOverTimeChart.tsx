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

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const daysInMonth = date.getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(`${monthName} ${i}`);
  }
  return days;
}

export default function ActionsClosedOverTimeChart({ month = 4, year = 2024 }: { month: number, year: number }) {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);

  const daysInMonth = getDaysInMonth(month, year);

  // Static data representing the number of actions closed each day (simulating the trend)
  const actionsClosedData = [
    5, 8, 4, 6, 7, 10, 9, 12, 14, 10, 15, 13, 
    18, 20, 17, 15, 19, 22, 25, 28, 30, 27, 25, 22, 
    20, 19, 18, 22, 25, 30
  ];

  // Calculate total and average actions closed
  const totalActionsClosed = actionsClosedData.reduce((acc, val) => acc + val, 0);
  const averageActionsClosed = totalActionsClosed / actionsClosedData.length;

  // Updated color palette with blue shades (to indicate actions being closed)
  const colorPalette = [
    theme.palette.info.dark,   // Light blue
    theme.palette.info.main,    // Medium blue
    theme.palette.info.main,    // Dark blue
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Actions Closed Over Time
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
              {totalActionsClosed} Actions
            </Typography>
            <Chip size="small" color="info" label={`+${Math.round(averageActionsClosed)} avg`} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Number of actions closed each day for the selected month
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[{
            scaleType: 'point',
            data: daysInMonth,
            tickInterval: (index, i) => (i + 1) % 5 === 0,
          }]}
          series={[{
            id: 'actionsClosed',
            label: 'Actions Closed',
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
            data: actionsClosedData, // Use the static data for actions closed
          }]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-actionsClosed': {
              fill: "url('#actionsClosed')",  // Apply the blue gradient
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.info.dark} id="actionsClosed" /> {/* Blue gradient */}
        </LineChart>
      </CardContent>
    </Card>
  );
}
