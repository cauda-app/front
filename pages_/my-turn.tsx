import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';

const MyTurn = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Button variant="danger">{t('common:cancel-turn')}</Button>{' '}
    </Layout>
  );
};

export default MyTurn;
