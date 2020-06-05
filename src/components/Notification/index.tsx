import React, { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import addMilliseconds from 'date-fns/addMilliseconds';
import { formattedTimeDifference } from 'src/utils/dates';

type Props = {
  show?: boolean;
  title: String;
  subTitle?: String;
  message: String;
  onConfirm: () => void;
  countDown?: number;
  confirmLabel?: String;
};

export default function Notification({
  show,
  title,
  subTitle,
  message,
  onConfirm,
  confirmLabel,
  countDown,
}: Props) {
  const { t } = useTranslation();
  const expiry = addMilliseconds(new Date(), countDown || 0);

  const [continueDisabled, setContinueDisabled] = useState(
    countDown !== undefined
  );
  const [countDownLabel, setCountDownLabel] = useState(
    formattedTimeDifference(expiry) || ''
  );

  useEffect(() => {
    if (!countDown) {
      return;
    }

    const interval = setInterval(() => {
      const formattedDif = formattedTimeDifference(expiry);
      if (formattedDif !== null) {
        setCountDownLabel(formattedDif);
      } else {
        setContinueDisabled(false);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const ModalComponent: React.ElementType = show ? Modal : Modal.Dialog;

  return (
    <ModalComponent show={show} onHide={onConfirm}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-5 px-3 text-center">
        <p>
          {subTitle && <strong className="d-block mb-3">{subTitle}</strong>}
          <span className="text-muted">{message}</span>
        </p>
        <Button
          variant="primary"
          size="lg"
          className={`d-flex justify-content-${
            continueDisabled ? 'center' : 'between'
          } align-items-center`}
          block
          onClick={onConfirm}
          disabled={continueDisabled}
        >
          {continueDisabled ? (
            countDownLabel
          ) : (
            <>
              <div></div>
              {confirmLabel ? confirmLabel : t('common:continue')}
              <FontAwesomeIcon icon={faArrowRight} />
            </>
          )}
        </Button>
      </Modal.Body>
    </ModalComponent>
  );
}
