/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js'
);

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

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/favicon.ico',
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
