import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';

const MyShop = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Button>{t('common:continue')}</Button>{' '}
    </Layout>
  );
};

export default MyShop;
