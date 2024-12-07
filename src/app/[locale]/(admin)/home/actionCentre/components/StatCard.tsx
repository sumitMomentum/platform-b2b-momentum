import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CountUp from "react-countup";

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: "success" | "error" | "neutral";
  data: number[];
  loading: boolean;
  chipLabel: string; // New property for the chip label
};

export default function StatCard({
  title,
  value,
  interval,
  trend,
  loading,
  chipLabel,
}: StatCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h4" component="p">
                {loading ? 0 : <CountUp end={Number(value)} />}
              </Typography>
              <Chip size="small" color={trend} label={chipLabel} />
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {interval}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
