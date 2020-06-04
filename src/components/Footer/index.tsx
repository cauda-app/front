import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Image from 'react-bootstrap/Image';

import getConfig from 'next/config';
const nextConfig = getConfig();

export default function Footer(props) {
  const { t } = useTranslation();

  return (
    <footer className="root">
      <ul className="list-inline text-center">
        <li className="list-inline-item">
          <Link href="/about">
            <a>{t('common:about')}</a>
          </Link>
        </li>
        <li className="list-inline-item">
          <Link href="/my-shop" passHref>
            <a>{t('common:shop-access')}</a>
          </Link>
        </li>
        <li className="list-inline-item">
          <a href="mailto:somos@cauda.app">{t('common:contact')}</a>
        </li>
      </ul>

      <div className="devlinks text-center">
        {/* FOR DEV: */}
        <Link href="/logout">
          <a>Logout</a>
        </Link>
      </div>

      <div className="version text-center">
        Version: {nextConfig?.publicRuntimeConfig?.version}
      </div>

      <Image src="/footer_cityscapes.png" fluid />

      <style jsx>{`
        .root {
          padding: 20px 0 0 0;
        }
        ul {
          margin-right: 15px;
          margin-bottom: 5px;
          margin-left: 15px;
          font-size: 0.8rem;
        }
        ul li {
          list-style: none;
        }
        .devlinks {
          opacity: 0.5;
          font-size: 0.7rem;
        }
        .devlinks a {
          padding: 5px;
          color: #666;
        }
        .version {
          opacity: 0.5;
          font-size: 0.7rem;
          padding: 5px;
          color: #666;
        }
      `}</style>
    </footer>
  );
}
