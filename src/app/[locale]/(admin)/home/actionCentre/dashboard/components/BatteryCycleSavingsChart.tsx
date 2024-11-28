import { Grid, Card, Typography, Box } from '@mui/material';

export default function BatteryCycleSavingsChart({ data }) {
  return (
    <Grid container spacing={3}>
      {data.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.vin}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {item.vin}
            </Typography>
            <Box display="flex" flexDirection="column">
              <Typography color="primary">Monthly: {item.batteryCycleSavingMonthly}</Typography>
              <Typography color="secondary">Yearly: {item.batteryCycleSavingYearly}</Typography>
              <Typography color="text.secondary">Lifetime: {item.batteryCycleSavingLifetime}</Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
