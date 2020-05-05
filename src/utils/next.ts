import { TokenInfo, verifyToken } from './../../graphql/utils/jwt';
import nextCookie from 'next-cookies';

export const processCookie = (req: any): TokenInfo | undefined => {
  const { token } = nextCookie({ req });
  if (!token) {
    return undefined;
  }

  return verifyToken(token);
};

export const requireLogin = (context): TokenInfo | undefined => {
  const token = processCookie(context.req);
  if (!token || !token.isValid) {
    let redirectToQuery = '?redirectTo=' + context.req.url;
    context.res.writeHead(303, {
      Location: '/register-phone' + redirectToQuery,
    });
    context.res.end();

    return;
  }

  return token;
};
