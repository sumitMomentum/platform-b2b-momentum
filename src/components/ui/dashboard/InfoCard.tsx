
// import { useTranslations } from 'next-intl';
import  Card  from '../commons/Card';

const InfoCard = ({ titleKey, descriptionKey, icon: Icon }) => {
  // const  t  = useTranslations();
  // const title = t(titleKey);
  // const description = t(descriptionKey);
  const title = titleKey;
  const description = descriptionKey;

  return (
    <Card>
      {/* <Card.Body> */}
      {/* <Card.Header> */}
      <div className="flex items-center p-3">
        <Icon className="w-8 h-8 inline-block mr-2" />
        <div>
          <Card.Title>{title}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </div>
      </div>
      {/* </Card.Header> */}
      {/* </Card.Body> */}
    </Card>
  );
};

export default InfoCard;