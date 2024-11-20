import Card from "@mui/material/Card";
import ConditionChart from "./ConditionChart";
import { Box, Container } from "@mui/material";
import CardContent from "@mui/material/CardContent"; // Added import
import CardHeader from "@mui/material/CardHeader"; // Added import
import Typography from "@mui/material/Typography"; // Added import
import { title } from "process";

const Condition = () => {
  return (
    <Card>
      <CardHeader title="Vehicle Condition" sx={{ margin: 2 }} />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            alignContent: "center",
          }} // Added padding
        >
          <ConditionChart />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Condition;
