import BsSpinner from 'react-bootstrap/Spinner';
import useTranslation from 'next-translate/useTranslation';

export default function Spinner({ className = '' }) {
  const { t } = useTranslation();

  return (
    <div className={`d-flex justify-content-center ${className}`}>
      <BsSpinner animation="border" variant="primary" role="status">
        <span className="sr-only">{t('common:loading')}</span>
      </BsSpinner>
    </div>
  );
}
