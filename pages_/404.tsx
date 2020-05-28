import NotFound from 'src/components/NotFound';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

export default function Cauda404() {
  useFirebaseMessage();

  return <NotFound />;
}
