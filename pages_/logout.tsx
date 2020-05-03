import React from 'react';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { serialize } from 'cookie';

export default function Logout() {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    'Set-Cookie',
    serialize('token', '', {
      path: '/',
      sameSite: 'strict',
      maxAge: -1,
    })
  );

  context.res.writeHead(303, {
    Location: '/',
  });
  context.res.end();

  return { props: {} };
};
