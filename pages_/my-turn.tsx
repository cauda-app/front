import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import img_qrcodeUrl from '../public/cauda_qrcode@3x.png';

const MyTurn = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Card className="cauda_card myturn__card mb-4 mx-auto">
        <Card.Header className="d-flex justify-content-between align-items-center">
          {t('common:shop-details')}

          <Button href="/" variant="danger" size="sm">
            {t('common:go-back')}
          </Button>
        </Card.Header>
        <Card.Body className="p-2 text-center">
          <Button href="" variant="link" className="py-0">
            <FontAwesomeIcon icon={faRedo} className="mr-2" />
            {t('common:my-turn')}
          </Button>

          <p className="myturn__number display-3">A21</p>

          <img
            className="myturn__qrcode img-fluid rounded mb-3"
            src={img_qrcodeUrl}
          ></img>

          <p className="myturn__timebox h2 font-weight-light mb-1">
            <span className="myturn__time font-weight-bold">25</span>{' '}
            {t('common:minutes')}
          </p>

          <p className="h6 mb-3 text-uppercase text-muted font-weight-light">
            Tiempo Restante Estimado
          </p>

          <Card className="myturn__turns mb-5">
            <Card.Body className="text-center">
              <p className="h6 text-uppercase text-muted font-weight-light">
                Últimos Números Atendidos
              </p>

              <ul className="list-unstyled list-inline h4 mb-0">
                <li className="list-inline-item text-success">A20</li>
                <li className="list-inline-item text-danger">A19</li>
                <li className="list-inline-item text-danger">A18</li>
                <li className="list-inline-item text-danger">A17</li>
                <li className="list-inline-item text-danger">A16</li>
              </ul>
            </Card.Body>
          </Card>

          <Button
            href=""
            variant="danger"
            size="lg"
            className="d-flex justify-content-between align-items-center"
            block
          >
            <FontAwesomeIcon icon={faTimes} />
            {t('common:cancel-turn')}
            <div></div>
          </Button>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default MyTurn;
