import Card from '@/components/ui/commons/Card';
import { useTranslations } from 'next-intl';


const VehicleDetails = ({year, model, make, vin, batteryCapacity, odometer}) => {
  const t = useTranslations();
  return (
    <Card>
      <Card.Body>
        <Card.Header>
          <Card.Title>{t('Vehicle Information')}</Card.Title>
        </Card.Header>
        <div>
          <Card.Description>{t(`Odometer : ${odometer}`)}</Card.Description>
          <Card.Description>{t(`Manufacturer : ${make}`)}</Card.Description>
          <Card.Description>{t(`Vehicle Model : ${model}`)}</Card.Description>
          <Card.Description>{t(`Model Year : ${year}`)}</Card.Description>
          <Card.Description>{t(`VIN : ${vin}`)}</Card.Description>
          <Card.Description>{t(`Battery Capacity : ${batteryCapacity}kWh`)}</Card.Description>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleDetails;
