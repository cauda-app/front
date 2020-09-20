import 'firebase/messaging';
import firebase from 'firebase/app';
import localforage from 'localforage';
import graphQLClient from 'src/graphqlClient';

const SAVE_FCM_TOKEN = /* GraphQL */ `
  mutation SaveFCMtoken($token: String!) {
    saveFCMtoken(token: $token)
  }
`;

const REMOVE_FCM_TOKEN = /* GraphQL */ `
  mutation RemoveFCMtoken {
    removeFCMtoken
  }
`;

const saveToken = (token) => graphQLClient.request(SAVE_FCM_TOKEN, { token });

const removeToken = () => graphQLClient.request(REMOVE_FCM_TOKEN);

const init = () => {
  try {
    if (firebase.apps.length > 0) {
      return;
    }

    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  } catch (error) {
    if (error.code !== 'messaging/unsupported-browser') {
      throw error;
    }
  }
};

const tokenInlocalforage = (): Promise<string> => {
  return localforage.getItem('fcm_token');
};

const messagingInstance = () => {
  try {
    if (firebase.apps.length === 0) {
      init();
    }

    return firebase.messaging();
  } catch (error) {
    if (error.code !== 'messaging/unsupported-browser') {
      throw error;
    }
  }
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
    if (
      error.code === 'messaging/unsupported-browser' ||
      error.message === 'Registration failed - push service error'
    ) {
      return;
    }

    if (error.code === 'messaging/permission-blocked') {
      // TODO: Log blocked requests
      return;
    }
    throw error;
  }
};

const removePermission = async () => {
  if ((await tokenInlocalforage()) === null) {
    return;
  }

  const storagePromise = localforage.removeItem('fcm_token');
  const tokenPromise = removeToken();
  return Promise.all([storagePromise, tokenPromise]);
};

const firebaseCloudMessaging = {
  init,
  requestPermission,
  removePermission,
  tokenInlocalforage,
  messagingInstance,
};

export { firebaseCloudMessaging };
