import useTranslation from 'next-translate/useTranslation';
import Layout from '../src/components/Layout';
import Button from 'react-bootstrap/Button';

const Shops = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Button>{t('common:nearby-shops')}</Button>
    </Layout>
  );
};

export default Shops;
