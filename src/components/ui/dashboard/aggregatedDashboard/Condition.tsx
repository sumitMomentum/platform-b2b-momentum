import Card from "@/components/ui/commons/Card";
import ConditionChart from "./ConditionChart";

const Condition = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>Vehicle Condition</Card.Title>
        </Card.Header>
        <div className="border">
          <ConditionChart />
        </div>
      </Card.Body>
    </Card>
  );
};

export default Condition;
