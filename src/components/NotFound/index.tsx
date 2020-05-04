import useTranslation from 'next-translate/useTranslation';
import Layout from '../Layout';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Layout>
      <h1>404 - {t('common:not-found')}</h1>
    </Layout>
  );
}
