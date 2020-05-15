import React from 'react';
import Button from 'react-bootstrap/Button';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  message: String;
  onConfirm: () => void;
};

export default function Notification({ message, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <div className="root">
      <div className="content">
        <p>{message}</p>
        <Button variant="primary" size="sm" onClick={onConfirm}>
          {t('common:continue')}
        </Button>
      </div>

      <style jsx>{`
        .root {
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 255, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .content {
          background-color: white;
        }
      `}</style>
    </div>
  );
}
