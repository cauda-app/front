import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Layout from '../src/components/Layout';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { GetServerSideProps } from 'next';

import { requireLogin } from 'src/utils/next';
import graphqlClient from 'src/graphqlClient';
//import useQuery, { State } from 'src/hooks/useQuery';
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';

const MyShop = ({ id }) => {
  const { t } = useTranslation();
  const [myShop, setMyShop] = useState<any>();
  const [firstFetch, setFirstFetch] = useState(true);
  const [loading, setLoading] = useState(true);

  const getShopData = async () => {
    const MY_SHOP = /* GraphQL */ `
      query MyShop {
        myShop {
          lastNumber
          nextNumber
          details {
            name
          }
          issuedNumber {
            id
            issuedNumber
            status
          }
        }
      }
    `;

    setLoading(true);
    const res = await graphqlClient.request(MY_SHOP);
    setMyShop(res.myShop);
    if (firstFetch) {
      setFirstFetch(false);
    }
    setLoading(false);
  };

  // fetch data
  useEffect(() => {
    getShopData();

    const interval = setInterval(() => {
      getShopData();
    }, 1000 * 10);

    return () => clearInterval(interval);
  }, []);

  if (firstFetch && loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Button href="/" variant="link" className="py-0">
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          </Button>
          <p>{myShop!.details.name}</p>
          <Button href="/form-shop" variant="link" size="sm">
            <FontAwesomeIcon icon={faPen} className="mr-2" />
          </Button>
        </Card.Header>

        <Card.Body className="p-2 text-center">
          <p className="myturn__number display-5">PRÓXIMO TURNO</p>
          <p className="myturn__number display-1">A21</p>

          <div className="pl-4 pr-4">
            <Button
              href=""
              variant="success"
              size="lg"
              className="d-flex justify-content-center align-items-center"
              block
            >
              {t('common:attend-turn')}
            </Button>

            <Button
              href=""
              variant="danger"
              size="lg"
              className="d-flex justify-content-center align-items-center"
              block
            >
              {t('common:turn-missed')}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <div className="mb-5">
        <div className="d-flex justify-content-center align-items-baseline">
          <span className="h6 text-uppercase text-muted font-weight-light mr-1">
            Turnos Pendientes
          </span>
          <span className="h2 text-uppercase text-muted font-weight-light">
            12
          </span>
        </div>

        <Button
          href=""
          variant="warning"
          size="lg"
          className="d-flex justify-content-center align-items-center"
          block
        >
          {t('common:cancel-pending')}
        </Button>
      </div>

      <div className="myturn__turns mb-5 text-center">
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
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = requireLogin(context);

  if (!token?.shopId) {
    context.res.writeHead(303, {
      Location: '/form-shop',
    });
    context.res.end();
  }

  return { props: { id: token?.shopId } };
};

export default MyShop;
