import Router from 'next/router';
import Trans from 'next-translate/Trans';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import Layout from 'src/components/Layout';
import { useRouter } from 'next/router';

import i18nConfig from '../../../i18n.json';

const { allLanguages, defaultLanguage } = i18nConfig;

function useLangFromRouter() {
  const { asPath } = useRouter();

  return allLanguages.reduce((result, l) => {
    if (new RegExp(`(^\/${l}\/)|(^\/${l}$)`).test(asPath)) return l;
    return result;
  }, defaultLanguage);
}

function Error({ statusCode }) {
  const lang = useLangFromRouter();

  return (
    <DynamicNamespaces
      dynamic={(_, ns) =>
        import(`../../../locales/${lang}/${ns}.json`).then((m) => m.default)
      }
      namespaces={['common']}
      fallback="Cargando..."
    >
      <Layout>
        <Row>
          <Col xs="auto" className="mx-auto">
            <div className="text-center">
              <h1 className="display-1 text-secondary">{statusCode}</h1>
              <p className="alert alert-secondary text-left">
                <Trans i18nKey="common:generic-error" />
              </p>
              <Button
                variant="primary"
                onClick={() => Router.reload()}
                block
                className="d-flex justify-content-between align-items-center py-2"
              >
                <FontAwesomeIcon icon={faRedo} fixedWidth />
                <Trans i18nKey="common:retry" />
                <div></div>
              </Button>
              <style jsx>{`
                p {
                  max-width: 300px;
                }
              `}</style>
            </div>
          </Col>
        </Row>
      </Layout>
    </DynamicNamespaces>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
