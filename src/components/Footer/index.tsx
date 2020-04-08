import useTranslation from 'next-translate/useTranslation';

export default function Footer(props) {
  const { t } = useTranslation();

  return (
    <ul>
      <li>{t('common:add-shop')}</li>
      <li>{t('common:about')}</li>
      <li>{t('common:contact')}</li>

      <style jsx>{`
        ul li {
          list-style: none;
        }
      `}</style>
    </ul>
  );
}
