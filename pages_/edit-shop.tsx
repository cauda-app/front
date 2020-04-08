import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';

const EditShop = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Button variant="success">{t('common:save')}</Button>{' '}
    </Layout>
  );
};

export default EditShop;
