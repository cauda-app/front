import jwt from 'jsonwebtoken';

import { TOKEN_EXPIRY } from '../utils/constants';

export type TokenInfo = {
  isValid: boolean;
  clientId?: number;
  shopId?: string;
  phone?: string;
  error?: any;
};

export const createToken = ({
  clientId,
  shopId,
  phone,
}: {
  clientId?: number;
  shopId?: string;
  phone: string;
}) => {
  return jwt.sign(
    {
      clientId,
      shopId,
      phone,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: `${TOKEN_EXPIRY}d` }
  );
};

export const verifyToken = (token: any): TokenInfo => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return {
      isValid: true,
      ...decoded as any,
    };
  } catch (error) {
    return { isValid: false, error };
  }
};
