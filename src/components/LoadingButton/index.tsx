import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
};

export default function LoadingButton({
  isLoading,
  children,
  ...props
}: Props & any) {
  const { t } = useTranslation();

  return (
    <Button block disabled={isLoading} {...props}>
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
      ) : (
        children
      )}
    </Button>
  );
}
