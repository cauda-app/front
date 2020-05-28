import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import Layout from 'src/components/Layout';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="content d-flex flex-column justify-content-between align-items-center h-100">
        <div></div>
        <Card className="cauda_card mt-2 mb-5 p-0 text-center">
          <Row noGutters>
            <Col xs="12" className="p-4">
              <h1 className="h4 mb-3">
                <strong>Fila virtual desde tu casa.</strong> ¡Gratis!
              </h1>

              <Link href="/shops" passHref>
                <Button
                  variant="primary"
                  className="d-flex justify-content-between align-items-center mb-3 py-2"
                  block
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} fixedWidth />
                  {t('common:view-nearby-shops')}
                  <div></div>
                </Button>
              </Link>

              <p className="mb-0 small_text">
                Con Cauda evitás estar en la calle más de lo necesario, ahorrás
                tiempo y no te ponés en riesgo.
              </p>
            </Col>
            <Col xs="12" className="py-4 px-4 bg_gray rounded_bottom d-lg-none">
              <h2 className="h4 mb-3">¿Estás en la calle?</h2>

              <Link href="/scan" passHref>
                <Button
                  variant="secondary"
                  className="d-flex justify-content-between align-items-center mb-3 py-2"
                  block
                >
                  <FontAwesomeIcon icon={faCamera} fixedWidth />
                  {t('common:scan-qr-code')}
                  <div></div>
                </Button>
              </Link>

              <p className="mb-0 small_text">
                Si ves un código QR en un negocio, escanealo, saca turno y
                esperá desde tu casa.
              </p>
            </Col>
          </Row>
        </Card>

        <div className="container px-0">
          <ul className="cauda_steps list-unstyled pt-4 px-1 p-sm-0 w-sm-100 d-md-flex mb-4">
            <li className="media col-12 col-md-4">
              <span className="home_step">
                <span>1</span>
              </span>
              <div className="media-body">
                <h5 className="h6 mb-4">
                  Buscá un comercio o escaneá un código QR.
                </h5>
              </div>
            </li>
            <li className="media col-12 col-md-4">
              <span className="home_step">
                <span>2</span>
              </span>
              <div className="media-body">
                <h5 className="h6 mb-4">
                  Hacé la fila tranquilo desde tu casa.
                </h5>
              </div>
            </li>
            <li className="media col-12 col-md-4">
              <span className="home_step">
                <span>3</span>
              </span>
              <div className="media-body">
                <h5 className="h6 mb-4">
                  Te avisaremos antes de que llegue tu turno.
                </h5>
              </div>
            </li>
          </ul>
        </div>

        <Row className="cauda_shops w-100 text-center py-5 mb-5">
          <Col className="d-flex flex-column justify-content-center align-items-center mx-auto">
            <h3 className="h4 mb-4 text-center">
              ¿Querés usar Cauda en tu comercio? <strong>¡Es gratis!</strong>{' '}
              <small>
                <small>(*)</small>
              </small>
            </h3>

            <p className="small_text">
              Usando Cauda contribuís a cuidar a tus clientes y entre todos{' '}
              <br className="d-none d-sm-block" />
              podemos lograr reducir el riesgo de contagio. Es rapidísimo.
            </p>

            <Link href="/my-shop" passHref>
              <Button
                variant="info"
                size="lg"
                block
                className="btn_myshop tertiary d-flex justify-content-between align-items-center py-2 mb-3"
              >
                <FontAwesomeIcon icon={faStoreAlt} fixedWidth />
                {t('common:add-my-shop')}
                <div></div>
              </Button>
            </Link>

            <small className="mb-0 text-muted">
              (*) para altos volúmenes de uso, Cauda se reserva el <br />
              derecho a requerir una contribución.
            </small>
          </Col>
        </Row>

        <div className="container">
          <div className="cauda_testimonials d-none">
            <h3 className="h4 mb-3 text-center">Los usuarios comentan...</h3>

            <ul className="list-unstyled px-1 p-sm-0 w-sm-100 d-sm-flex justify-content-center align-items-center">
              <li className="media col-12 col-sm-4 mb-3">
                <img src="..." className="mr-3" alt="..." />
                <div className="media-body">
                  <p className="mb-0">
                    “Desde que uso Cauda paso mucho menos tiempo en la calle, me
                    siento más seguro. Cuido a mi familia y a todo mi barrio”
                  </p>
                  <strong>Javier, vecino</strong>
                </div>
              </li>

              <li className="media col-12 col-sm-4 mb-3">
                <img src="..." className="mr-3" alt="..." />
                <div className="media-body">
                  <p className="mb-0">
                    “Desde que uso Cauda paso mucho menos tiempo en la calle, me
                    siento más seguro. Cuido a mi familia y a todo mi barrio”
                  </p>
                  <strong>Laura, dietética Moni</strong>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mb-5">
          <h3 className="h4 mb-3 text-center">Nos apoyan</h3>

          <p className="text-center">
            Google, AWS, Conciencia, Helpers, Wingu, Beccar Varela, Notimation
          </p>
        </div>
      </div>

      <style jsx global>{`
        .btn_myshop {
          width: 100%;
          max-width: 280px;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
