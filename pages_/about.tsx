import useTranslation from 'next-translate/useTranslation';
import Layout from 'src/components/Layout';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import Media from 'react-bootstrap/Media';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import useFirebaseMessage from 'src/hooks/useFirebaseMessage';

export default function AboutUs() {
  const { t } = useTranslation();
  useFirebaseMessage();

  return (
    <Layout>
      <Card className="cauda_card cauda_about mt-1 mb-4 mx-auto">
        <Card.Header className="text-center">
          <h2 className="h4 mb-0">{t('common:about')}</h2>
        </Card.Header>
        <Card.Body>
          <p>{t('common:about-1')}</p>

          <p className="mb-4">{t('common:about-2')}</p>

          <hr />

          <div className="Xcard mb-2 p-2 text-center">
            {t('common:about-contact')}
            <a href="mailto:somos@cauda.app" className="">
              somos@cauda.app
            </a>
          </div>

          {/* <Link href={'/contact'} passHref>
            <Button
              variant="primary"
              className="d-flex justify-content-between align-items-center py-2"
            >
              <div></div>
              {t('common:contact')}
              <FontAwesomeIcon icon={faArrowRight} fixedWidth />
            </Button>
          </Link> */}

          <hr className="mt-3 mb-5" />

          <h4 className="h5 font-weight-bold Xtext-center mt-4 mb-4">
            {t('common:about-team')}
          </h4>

          <ul className="list-unstyled mb-0">
            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/PabloWolfus.jpg"
                alt="Pablo Wolfus"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/pwolfus/'}>
                    <a target="_blank">Pablo Wolfus</a>
                  </Link>
                </h5>
                <p>{t('common:team-lead')}</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/MauricioGrijalba.jpg"
                alt="Mauricio Grijalba"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/mauriciogrijalba/'}>
                    <a target="_blank">Mauricio Grijalba</a>
                  </Link>
                </h5>
                <p>{t('common:ui-designer')}</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/RamiroVazquez.jpg"
                alt="Ramiro Vazquez"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/ramirotw/'}>
                    <a target="_blank">Ramiro Vazquez</a>
                  </Link>
                </h5>
                <p>{t('common:software-engineer')}</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/NicolasDominguez.jpg"
                alt="Nicolás Dominguez"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/nicoo/'}>
                    <a target="_blank">Nicolás Dominguez</a>
                  </Link>
                </h5>
                <p>{t('common:software-engineer')}</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/IgnacioNieto.jpg"
                alt="Ignacio Nieto"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/nietofarias/'}>
                    <a target="_blank">Ignacio Nieto</a>
                  </Link>
                </h5>
                <p>{t('common:legals-strategy')}</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/LeonelGierberg.jpg"
                alt="Leonel Gierberg"
              />
              <Media.Body>
                <h5>
                  <Link
                    href={
                      '//www.linkedin.com/in/leonel-santiago-gierberg-15167277/'
                    }
                  >
                    <a target="_blank">Leonel Gierberg</a>
                  </Link>
                </h5>
                <p>{t('common:legals-strategy')}</p>
              </Media.Body>
            </Media>
          </ul>

          <p className="mt-1 font-weight-bold">{t('common:collaborators')}</p>

          <ul className="list-unstyled">
            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/JoseDobla.jpg"
                alt="José Doblá"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/doblajose/'}>
                    <a target="_blank">José Doblá</a>
                  </Link>
                </h5>
                <p>Devops</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/JosefinaTousBercovich.jpg"
                alt="Josefina Tous Bercovich"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/josefina-tous-bercovich/'}>
                    <a target="_blank">Josefina Tous Bercovich</a>
                  </Link>
                </h5>
                <p>{t('common:social-media-training')}</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/DeboraEdelberg.jpg"
                alt="Débora Edelberg"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/deboraedelberg/'}>
                    <a target="_blank">Débora Edelberg</a>
                  </Link>
                </h5>
                <p>{t('common:ui-designer-female')}</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/ArielLipschutz.jpg"
                alt="Ariel Lipschutz"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/ariellipschutz/'}>
                    <a target="_blank">Ariel Lipschutz</a>
                  </Link>
                </h5>
                <p>{t('common:team-lead')} Chatbot</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/FacundoStancanelli.jpg"
                alt="Facundo Stancanelli"
              />
              <Media.Body>
                <h5>Facundo Stancanelli</h5>
                <p>{t('common:software-engineer')}</p>
              </Media.Body>
            </Media>

            <Media as="li">
              <img
                width={50}
                height={50}
                src="/team/SebastianNieto.jpg"
                alt="Sebastián Nieto"
              />
              <Media.Body>
                <h5>
                  <Link href={'//www.linkedin.com/in/sebastián-nieto-farías/'}>
                    <a target="_blank">Sebastián Nieto</a>
                  </Link>
                </h5>
                <p>{t('common:production-reel')}</p>
              </Media.Body>
            </Media>
          </ul>
        </Card.Body>
      </Card>
    </Layout>
  );
}
