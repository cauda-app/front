import admin from 'firebase-admin';
import * as Sentry from '@sentry/node';

type Notification = {
  title: string;
  body: string;
};

export const sendMessage = async (
  notification: Notification,
  token: string
) => {
  var message = {
    data: notification,
    token,
  };

  try {
    const messageId = await admin.messaging().send(message);
    console.log(`FCM: Notification with ID ${messageId} sent`);
    return messageId;
  } catch (error) {
    console.log('FCM: Error sending notification. ', error);
    Sentry.captureException(error);
    return '';
  }
};
