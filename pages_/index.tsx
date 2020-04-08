import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';
import Box from '../src/components/Box';

const Home = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Box>
        <div className="buttons-box">
          <Button variant="primary">{t('common:nearby-shops')}</Button>
          <Button variant="danger">{t('common:scan-qr-code')}</Button>
        </div>
      </Box>
      <Button variant="warning">{t('common:my-shop')}</Button>{' '}
      <p>{t('common:my-active-turns')}</p>
      <style jsx>{`
        .buttons-box {
          padding: 20px;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
