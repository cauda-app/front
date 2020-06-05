import React from 'react';
import Notification from '../Notification';

type ModalInfo = {
  message: string;
  buttonLabel: string;
};

export const NotificationContext = React.createContext(
  (modalInfo: ModalInfo) => {}
);

function NotificationProvider({ children }) {
  const [modalInfo, setModalInfo] = React.useState<ModalInfo | null>(null);

  const handleModalOpen = React.useCallback((modalInfo: ModalInfo | null) => {
    setModalInfo(modalInfo);
  }, []);

  return (
    <NotificationContext.Provider value={handleModalOpen}>
      {children}
      {modalInfo ? (
        <Notification
          show={!!modalInfo}
          title="CAUDA"
          message={modalInfo.message}
          onConfirm={() => handleModalOpen(null)}
          confirmLabel={modalInfo.buttonLabel}
        />
      ) : null}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
