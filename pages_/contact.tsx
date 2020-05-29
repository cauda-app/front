import Contact from 'src/components/Contact';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

export default function ContactUs() {
  useFirebaseMessage();

  return <Contact />;
}
