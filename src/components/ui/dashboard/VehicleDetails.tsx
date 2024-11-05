import Card from '@/components/ui/commons/Card';
import { useTranslations } from 'next-intl';


const VehicleDetails = ({year, model, make, vin, batteryCapacity, odometer, }) => {
  const t = useTranslations("AdminLayout.pages.vehicleDashboard");
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>{t('vehicleInformation')}</Card.Title>
        </Card.Header>
        <div>
          <Card.Description>{t(`odometer`)} : {odometer}</Card.Description>
          <Card.Description>{t(`manufacturer`)} : {make}</Card.Description>
          <Card.Description>{t(`vehicleModel`)} : {model}</Card.Description>
          <Card.Description>{t(`modelYear`)} : {year}</Card.Description>
          <Card.Description>{t(`vin`)} : {vin}</Card.Description>
          <Card.Description>{t(`batteryCapacity`)} : {batteryCapacity}kWh</Card.Description>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleDetails;
