import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function SavingsDistributionChart({ savingsData }: { savingsData: any[] }) {
  const theme = useTheme();

  const vehicleData = savingsData.map(item => ({
    label: item.vehicleId,
    value: item.costSavingChargingMonthly
  }));

  const colorPalette = [
    (theme.vars || theme).palette.success.dark,  // Dark green
    (theme.vars || theme).palette.success.main,  // Medium green
    (theme.vars || theme).palette.success.light, // Light green
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Savings Distribution by Vehicle
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
              {vehicleData.reduce((acc, item) => acc + item.value, 0).toFixed(2)} USD
            </Typography>
            <Chip size="small" color="error" label="-8%" /> {/* Example label, update as needed */}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Savings distribution for the last 6 months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: vehicleData.map(item => item.label),
            },
          ]}
          series={[
            {
              id: 'savings',
              label: 'Savings',
              data: vehicleData.map(item => item.value),
              stack: 'A',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}