import useTranslation from 'next-translate/useTranslation';
import Layout from 'src/components/Layout';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

export default function AboutUs() {
  const { t } = useTranslation();
  useFirebaseMessage();

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="text-center">{t('common:about')}</Card.Header>
        <Card.Body>
          <p>{t('common:about-1')}</p>

          <p>{t('common:about-2')}</p>

          <p>
            {t('common:about-contact')}
            <a href="mailto:somos@cauda.app">somos@cauda.app</a>
          </p>

          {/* <Carousel className="mb-3">
            <Carousel.Item>
              <img className="d-block w-100" src="" alt="Feature 1" />
              <Carousel.Caption>
                <h3>Feature 1</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img className="d-block w-100" src="" alt="Feature 2" />

              <Carousel.Caption>
                <h3>Feature 2</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img className="d-block w-100" src="" alt="Feature 3" />

              <Carousel.Caption>
                <h3>Feature 3</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl
                  consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel> */}

          <p className="font-weight-bold mb-4">{t('common:about-team')}</p>

          <p>
            <label>Pablo Wolfus [{t('common:team-lead')}] </label>
            <label>Mauricio Grijalba [UI/UX] Ramiro</label>
            <label>Vazquez [{t('common:software-engineer')}] </label>
            <label>Nicolás Dominguez [{t('common:software-engineer')}]</label>
            <label>Ignacio Nieto [{t('common:legals-strategy')}] </label>
            <label>Leonel Gierberg [{t('common:legals-strategy')}]</label>
          </p>

          <p>{t('common:collaborators')}</p>
          <p>
            <label>José Doblá [Devops]</label>
            <label>
              Josefina Tous Bercovich [{t('common:social-media-training')}]
            </label>
            <label>Débora Edelberg [UI/UX]</label>
            <label>Ariel Lipschutz [{t('common:team-lead')} chatbot]</label>
            <label>Facundo Stancanelli [{t('common:software-engineer')}]</label>
            <label>Sebastián Nieto [{t('common:production-reel')}]</label>
            <label>Diego Lopez León [{t('common:software-engineer')}]</label>
          </p>

          {/* <Button
            variant="primary"
            href="/contact"
            block
            className="d-flex justify-content-between align-items-center py-2"
          >
            <div></div>
            {t('common:contact')}
            <FontAwesomeIcon icon={faArrowRight} fixedWidth />
          </Button> */}
        </Card.Body>
      </Card>
    </Layout>
  );
}
