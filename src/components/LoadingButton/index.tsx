import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import useTranslation from 'next-translate/useTranslation';

export default function LoadingButton({ isLoading, label, ...rest }) {
  const { t } = useTranslation();

  return (
    <Button
      type="submit"
      variant="success"
      size="lg"
      className="mt-4"
      block
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        >
          <span className="sr-only">{t('common:loading')}</span>
        </Spinner>
      ) : null}
      {label}
    </Button>
  );
}
