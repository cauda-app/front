import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

type Props = {
  page?: string;
  label?: string;
};

const GoBack = ({ page = '/', label }: Props) => (
  <Link href={page} passHref>
    <Button variant="link" className="py-0 text-dark">
      <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
      {label !== undefined && label}
    </Button>
  </Link>
);
export default GoBack;
