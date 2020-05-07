import useTranslation from 'next-translate/useTranslation';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { GetServerSideProps } from 'next';

import { requireLogin } from 'src/utils/next';
import Layout from 'src/components/Layout';
import useQuery from 'src/hooks/useQuery';
import Spinner from 'src/components/Spinner';

const MY_SHOP = /* GraphQL */ `
  query MyShop {
    myShop {
      details {
        name
      }
      nextTurn
      lastTurnsAttended
      pendingTurnsAmount
    }
  }
`;

const MyShop = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(MY_SHOP, { pollInterval: 10_000 });

  if (!data.myShop && loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (error) {
    return <Layout>{String(error)}</Layout>;
  }

  return (
    <Layout>
      <Card className="cauda_card mb-4 mx-auto">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Button href="/" variant="link" className="py-0">
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          </Button>
          <p>{data.myShop!.details.name}</p>
          <Button href="/form-shop" variant="link" size="sm">
            <FontAwesomeIcon icon={faPen} className="mr-2" />
          </Button>
        </Card.Header>

        <Card.Body className="p-2 text-center">
          {data.myShop!.nextTurn ? (
            <>
              <p className="myturn__number display-5 text-uppercase">
                {t('common:next-turn')}
              </p>
              <p className="myturn__number display-1">
                {data.myShop!.nextTurn}
              </p>

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
            </>
          ) : (
            <p className="myturn__number display-5 text-uppercase">
              {t('common:no-turns')}
            </p>
          )}
        </Card.Body>
      </Card>

      <div className="mb-5">
        <div className="d-flex justify-content-center align-items-baseline">
          <span className="h6 text-uppercase text-muted font-weight-light mr-1">
            {t('common:pending-turns')}
          </span>
          <span className="h2 text-uppercase text-muted font-weight-light">
            {data.myShop!.pendingTurnsAmount}
          </span>
        </div>

        <Button
          disabled={data.myShop.pendingTurnsAmount === 0}
          href=""
          variant="warning"
          size="lg"
          className="d-flex justify-content-center align-items-center"
          block
        >
          {t('common:cancel-pending')}
        </Button>
      </div>

      {data.myShop!.lastTurnsAttended.length > 0 ? (
        <div className="myturn__turns mb-5 text-center">
          <p className="h6 text-uppercase text-muted font-weight-light">
            {t('common:last-numbers')}
          </p>

          <ul className="list-unstyled list-inline h4 mb-0">
            {data.myShop!.lastTurnsAttended.map((turn, index) => (
              <li key={index} className="list-inline-item text-success">
                {turn}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
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

  return { props: {} };
};

export default MyShop;
