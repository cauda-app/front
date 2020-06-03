import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import Image from 'react-bootstrap/Image';

import getConfig from 'next/config';
import { useRouter } from 'next/router';
const nextConfig = getConfig();

export default function Footer(props) {
  const { t } = useTranslation();
  const router = useRouter();

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

      {(process.env.NODE_ENV !== 'production' ||
        router.pathname === '/my-shop') && (
        <div className="devlinks text-center">
          <Link href="/logout">
            <a>Logout</a>
          </Link>
        </div>
      )}

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
