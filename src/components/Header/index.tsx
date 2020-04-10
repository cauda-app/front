import useTranslation from 'next-translate/useTranslation';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from 'next/link';
import Image from 'react-bootstrap/Image';

export default function Header(props) {
  const { t } = useTranslation();

  return (
    <header>
      <Row>
        <Col className="text-center py-4">
          <Link href="/">
            <a><Image src="cauda_logo.svg" /></a>
          </Link>
        </Col>
      </Row>

      <style jsx>{`
        footer {
          text-align: center;
        }
        ul {
          margin-bottom: 5px;
        }
        ul li {
          list-style: none;
        }
        .devlinks {
          font-size: 0.8rem;
          opacity: 0.5;
        }
        .devlinks a {
          padding: 5px;
          color: #666;
        }
      `}</style>
    </header>
  );
}
