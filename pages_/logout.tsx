import React from 'react';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { serialize } from 'cookie';

export default function Logout() {
  React.useEffect(() => {
    Router.push('/');
  }, []);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
