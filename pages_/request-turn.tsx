import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';

const RequestTurn = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Button>{t('common:request-turn')}</Button>{' '}
    </Layout>
  );
};

export default RequestTurn;
