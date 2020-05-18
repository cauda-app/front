import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

import getConfig from 'next/config';
const nextConfig = getConfig();

export default function Footer(props) {
  const { t } = useTranslation();

  return (
    <footer className="root">
      <ul className="list-inline text-center">
        <li className="list-inline-item">{t('common:add-shop')}</li>
        <li className="list-inline-item">
          <Link href="/about">{t('common:about')}</Link>
        </li>
        <li className="list-inline-item">
          <Link href="/contact">{t('common:contact')}</Link>
        </li>
      </ul>

      <div className="devlinks text-center">
        FOR DEV:
        <Link href="/logout">
          <a>Logout</a>
        </Link>
      </div>

      <div className="version text-center">
        Version: {nextConfig?.publicRuntimeConfig?.version}
      </div>

      <style jsx>{`
        .root {
          padding: 20px;
        }
        ul  {
          margin-bottom: 5px;
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
