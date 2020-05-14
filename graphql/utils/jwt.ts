import jwt from 'jsonwebtoken';
import addDays from 'date-fns/addDays';
import { serialize } from 'cookie';

import { TOKEN_EXPIRY } from '../utils/constants';

export type TokenInfo = {
  isValid: boolean;
  clientId?: number;
  shopId?: number;
  phone?: string;
  error?: any;
};

export const setCookieToken = (
  res: any,
  {
    clientId,
    shopId,
    phone,
  }: {
    clientId?: number;
    shopId?: number;
    phone: string;
  }
) => {
  const token = jwt.sign(
    {
      clientId,
      shopId,
      phone,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: `${TOKEN_EXPIRY}d` }
  );

  res.setHeader(
    'Set-Cookie',
    serialize('token', token, {
      expires: addDays(new Date(), TOKEN_EXPIRY),
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    })
  );
};

export const verifyToken = (token: any): TokenInfo => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return {
      isValid: true,
      ...(decoded as any),
    };
  } catch (error) {
    return { isValid: false, error };
  }
};
