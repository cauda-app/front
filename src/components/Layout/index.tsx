import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Header from '../Header';
import Footer from '../Footer';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Cauda</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container className="app" fluid>
        <Header />

        <main>{children}</main>

        <Footer />
      </Container>
    </>
  );
}
