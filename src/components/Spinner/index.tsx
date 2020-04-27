import BsSpinner from 'react-bootstrap/Spinner';
import useTranslation from 'next-translate/useTranslation';

export default function Spinner() {
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-center">
      <BsSpinner animation="border" variant="primary" role="status">
        <span className="sr-only">{t('common:loading')}</span>
      </BsSpinner>
    </div>
  );
}
