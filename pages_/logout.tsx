import React from 'react';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { serialize } from 'cookie';
import { getToken } from 'src/utils/next';

export default function Logout() {
  React.useEffect(() => {
    Router.push('/');
  }, []);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);

  // Allow to logout only shops
  if (process.env.NODE_ENV === 'production' && !token?.clientId) {
    return { props: {} };
  }

  context.res.setHeader(
    'Set-Cookie',
    serialize('token', '', {
      path: '/',
      sameSite: 'strict',
      maxAge: -1,
    })
  );

  return { props: {} };
};
