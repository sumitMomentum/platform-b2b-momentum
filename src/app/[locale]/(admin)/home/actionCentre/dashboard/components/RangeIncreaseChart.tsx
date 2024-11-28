import React from 'react';
import { Grid, Box, Typography, LinearProgress, Card } from '@mui/material';

export default function RangeIncreaseChart({ data }) {
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
                Monthly Range Increase
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.rangeIncreaseMonthly, 100)}
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.rangeIncreaseMonthly} km</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography color="secondary" variant="body2">
                Yearly Range Increase
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.rangeIncreaseYearly, 100)}
                color="secondary"
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.rangeIncreaseYearly} km</Typography>
            </Box>

            <Box>
              <Typography color="success.main" variant="body2">
                Lifetime Range Estimate
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.rangeIncreaseLifetimeEstimate, 100)}
                color="success"
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.rangeIncreaseLifetimeEstimate} km</Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
