import { useEffect, useContext } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { firebaseCloudMessaging } from 'src/utils/web-push';
import { NotificationContext } from 'src/components/NotificationProvider';

function useFirebaseMessage() {
  const { t } = useTranslation();
  const showModal = useContext(NotificationContext);

  useEffect(() => {
    const messaging = firebaseCloudMessaging.messagingInstance();

    if (messaging) {
      const unsubscribe = messaging.onMessage((payload) => {
        showModal({
          message: payload.notification?.body,
          buttonLabel: t('common:close'),
        });
      });

      return () => unsubscribe();
    }
  }, []);
}

export default useFirebaseMessage;
