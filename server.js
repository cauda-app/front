require('dotenv').config();
const express = require('express');
const next = require('next');
const admin = require('firebase-admin');

const firebaseService = (process.env.FIREBASE_CONFIG || '{}').replace(
  /\\\\/g, // escape private_key backslashes
  '\\'
);
const firebaseServiceConfig = JSON.parse(firebaseService);

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceConfig),
  databaseURL: 'https://cauda-51729.firebaseio.com',
});

const port = parseInt(process.env.PORT || '0', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/service-worker.js', (req, res) => {
    app.serveStatic(req, res, './.next/service-worker.js');
  });

  const serviceWorkers = [
    {
      filename: 'service-worker.js',
      path: './.next/service-worker.js',
    },
    {
      filename: 'firebase-messaging-sw.js',
      path: './public/firebase-messaging-sw.js',
    },
  ];

  serviceWorkers.forEach(({ filename, path }) => {
    server.get(`/${filename}`, (req, res) => {
      app.serveStatic(req, res, path);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
