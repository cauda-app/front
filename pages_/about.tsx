import useTranslation from 'next-translate/useTranslation';
import Layout from 'src/components/Layout';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="text-center">{t('common:about')}</Card.Header>
        <Card.Body>
          <p className="font-weight-bold mb-4">
            Lorem ipsum dolor sit amet erat consectetur adipiscing elit.
          </p>

          <Carousel className="mb-3">
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
          </Carousel>

          <p>
            Aliquam ac metus dolor. Mauris id lacus commodo erat hendrerit
            vulputate in sit amet dolor. Quisque ac aliquet augue. Ut arcu
            ligula, dapibus id laoreet nec, elementum vel tortor. Nulla nec orci
            nec ligula tempus venenatis nec at dui.{' '}
          </p>

          <Button
            variant="primary"
            href="/contact"
            block
            className="d-flex justify-content-between align-items-center py-2"
          >
            <div></div>
            {t('common:contact')}
            <FontAwesomeIcon icon={faArrowRight} fixedWidth />
          </Button>
        </Card.Body>
      </Card>
    </Layout>
  );
}
