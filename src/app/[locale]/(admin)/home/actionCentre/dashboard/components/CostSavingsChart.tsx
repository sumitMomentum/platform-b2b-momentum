import React from 'react';
import { Box, Grid, Typography, LinearProgress, Card } from '@mui/material';

export default function CostSavingsChart({ data }) {
  return (
    <Grid container spacing={3}>
      {data.map((item) => (
        <Grid item xs={12} md={4} key={item.vin}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              VIN: {item.vin}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography color="primary" variant="body2">
                Monthly Savings
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.costSavingChargingMonthly, 100)}
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.costSavingChargingMonthly}%</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography color="secondary" variant="body2">
                Yearly Savings
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.costSavingChargingYearly, 100)}
                color="secondary"
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.costSavingChargingYearly}%</Typography>
            </Box>

            <Box>
              <Typography color="text.secondary" variant="body2">
                Lifetime Estimate Savings
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.costSavingChargingLifeTimeEstimate, 100)}
                color="success"
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.costSavingChargingLifeTimeEstimate}%</Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
