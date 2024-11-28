import React from 'react';
import { Grid, Box, Typography, LinearProgress, Card } from '@mui/material';

export default function DegradationChart({ data }) {
  return (
    <Grid container spacing={3}>
      {data.map((item) => (
        <Grid item xs={12} md={6} key={item.vin}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              VIN: {item.vin}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography color="primary" variant="body2">
                Initial SoH
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.initialSoH, 100)}
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.initialSoH}%</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography color="secondary" variant="body2">
                Estimated Degradation
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.estimatedDegradation, 100)}
                color="secondary"
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.estimatedDegradation}%</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography color="success.main" variant="body2">
                Actual Degradation
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(item.actualDegradation, 100)}
                color="success"
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.actualDegradation}%</Typography>
            </Box>

            <Box>
              <Typography color="error.main" variant="body2">
                Difference
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.abs(Math.min(item.difference, 100))}
                color="error"
                sx={{ height: 10 }}
              />
              <Typography variant="body2">{item.difference}%</Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
