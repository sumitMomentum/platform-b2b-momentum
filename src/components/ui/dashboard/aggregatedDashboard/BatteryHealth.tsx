import Card from "@/components/ui/commons/Card";
import React from "react";
// import { useTranslations } from "next-intl";
import BatteryHealthChart from "./BatteryHealthChart";

const BatteryHealth = () => {
  // const t = useTranslations();
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>Battery Health</Card.Title>
        </Card.Header>
        <div className="flex justify-evenly border mb-2">
          <BatteryHealthChart />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-evenly">
            <Card.Description>Avg SoH</Card.Description>
            <Card.Description>100%</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>
              Avg Estimated Degradation
            </Card.Description>
            <Card.Description>0.00%</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>Total Batteries</Card.Description>
            <Card.Description>300</Card.Description>
          </div>
        </div>
        <div className="flex justify-between">
          {/* <div className="flex flex-col justify-evenly">
            <Card.Description>{t('')}</Card.Description>
            <Card.Description>{t('300')}</Card.Description>
          </div>
          <div className="flex flex-col justify-evenly">
            <Card.Description>{t('Battery Condition')}</Card.Description>
            <Card.Description>{t('')}</Card.Description>
          </div> */}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BatteryHealth;
