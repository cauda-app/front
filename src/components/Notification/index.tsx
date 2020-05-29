import React from 'react';
import Button from 'react-bootstrap/Button';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  message: String;
  onConfirm: () => void;
  confirmLabel?: String;
};

export default function Notification({
  message,
  onConfirm,
  confirmLabel,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="root">
      <div className="content">
        <p>{message}</p>
        <Button variant="primary" size="sm" onClick={onConfirm}>
          {confirmLabel ? confirmLabel : t('common:continue')}
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
          background-color: rgba(29, 29, 31, 0.74);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .content {
          margin: 15px;
          padding: 15px;
          text-align: center;
          background-color: white;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
