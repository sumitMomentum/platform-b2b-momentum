import Card from "@/components/ui/commons/Card";
import ConditionChart from "./ConditionChart";
import { Container } from "@mui/material";
import CardContent from "@mui/material/CardContent"; // Added import
import CardHeader from "@mui/material/CardHeader"; // Added import
import Typography from "@mui/material/Typography"; // Added import
import { title } from "process";

const Condition = () => {
  return (
    <Card>
      <CardHeader title="Vehicle Condition" sx={{ margin: 2 }} />
      <CardContent>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            p: 2,
          }} // Added padding
        >
          <ConditionChart />
        </Container>
      </CardContent>
    </Card>
  );
};

export default Condition;
