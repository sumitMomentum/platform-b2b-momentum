import Card from "@/components/ui/commons/Card";
import ConditionChart from "./ConditionChart";
import { Container } from "@mui/material";

const Condition = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>Vehicle Condition</Card.Title>
        </Card.Header>
        <Container
          sx={{ display: "flex", justifyContent: "center", border: 0.5, mb: 2 }}
        >
          <ConditionChart />
        </Container>
      </Card.Body>
    </Card>
  );
};

export default Condition;
