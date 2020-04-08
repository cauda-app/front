import useTranslation from 'next-translate/useTranslation';
import Spinner from 'react-bootstrap/Spinner';
import Layout from '../src/components/Layout';

const Scan = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Spinner animation="border" role="status">
        <span className="sr-only">{t('common:loading')}</span>
      </Spinner>
      <p>{t('common:processing-qr')}</p>
    </Layout>
  );
};

export default Scan;
