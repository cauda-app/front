import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default function Footer(props) {
  const { t } = useTranslation();

  return (
    <footer>
      <ul className="list-inline">
        <li className="list-inline-item">{t('common:add-shop')}</li>
        <li className="list-inline-item">{t('common:about')}</li>
        <li className="list-inline-item">{t('common:contact')}</li>
      </ul>

      <div className="devlinks">
        FOR DEV:
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>

      <div>Version: {publicRuntimeConfig.version}</div>

      <style jsx>{`
        footer  {
          text-align: center;
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
      `}</style>
    </footer>
  );
}
