import 'firebase/messaging';
import firebase from 'firebase/app';
import localforage from 'localforage';
import * as Sentry from '@sentry/browser';
import graphQLClient from 'src/graphqlClient';

const SAVE_FCM_TOKEN = /* GraphQL */ `
  mutation SaveFCMtoken($token: String!) {
    saveFCMtoken(token: $token)
  }
`;

const saveToken = (token) => {
  return graphQLClient.request(SAVE_FCM_TOKEN, { token });
};

const init = () => {
  if (firebase.apps.length > 0) {
    return;
  }

  firebase.initializeApp({
    apiKey: 'AIzaSyAnVih3kHw9T99xVpfsOlqwJP2TsZydv3I',
    authDomain: 'cauda-51729.firebaseapp.com',
    databaseURL: 'https://cauda-51729.firebaseio.com',
    projectId: 'cauda-51729',
    storageBucket: 'cauda-51729.appspot.com',
    messagingSenderId: '195437660977',
    appId: '1:195437660977:web:ea98dc48734274e1d77e10',
    measurementId: 'G-BQQ9NMT9QH',
  });
};

const tokenInlocalforage = (): Promise<string> => {
  return localforage.getItem('fcm_token');
};

const messagingInstance = () => {
  if (firebase.apps.length === 0) {
    init();
  }

  return firebase.messaging();
};

const requestPermission = async () => {
  try {
    if ((await tokenInlocalforage()) !== null) {
      return;
    }

    const messaging = firebase.messaging();

    await messaging.requestPermission();
    const token = await messaging.getToken();

    localforage.setItem('fcm_token', token);
    await saveToken(token);

    messaging.onTokenRefresh(async () => {
      const refreshedToken = await messaging.getToken();
      saveToken(refreshedToken);
    });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
  }
};

const firebaseCloudMessaging = {
  init,
  requestPermission,
  tokenInlocalforage,
  messagingInstance,
};

export { firebaseCloudMessaging };
