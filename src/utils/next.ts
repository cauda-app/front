import { TokenInfo, verifyToken } from './../../graphql/utils/jwt';
import nextCookie from 'next-cookies';

export const processCookie = (req: any): TokenInfo | undefined => {
  const { token } = nextCookie({ req });
  if (!token) {
    return undefined;
  }

  return verifyToken(token);
};

export const getToken = (context): TokenInfo | null => {
  const token = processCookie(context.req);
  if (!token || !token.isValid) {
    return null;
  }

  return token;
};
