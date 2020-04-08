import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Footer from '../Footer';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Cauda</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container className="container">
        <Row>
          <Col>CAUDA LOGO</Col>
        </Row>

        <Row>
          <Col>{children}</Col>
        </Row>

        <Row>
          <Col>
            <Footer />
          </Col>
        </Row>

        <style jsx>{`
          .container {
            padding: 20px;
          }
        `}</style>
      </Container>
    </>
  );
}
