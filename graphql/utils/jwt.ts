import jwt from 'jsonwebtoken';

import { TOKEN_EXPIRY } from '../utils/constants';

export const createToken = ({
  clientId,
  shopId,
}: {
  clientId?: number;
  shopId?: string;
}) => {
  return jwt.sign(
    {
      clientId,
      shopId,
    },
    process.env.JWT_SECRET,
    { expiresIn: `${TOKEN_EXPIRY}d` }
  );
};

export const verifyToken = (
  token: any
): { isValid: boolean; clientId?: number; shopId?: string } => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      isValid: true,
      clientId: decoded.clientId,
      shopId: decoded.shopId,
    };
  } catch (error) {
    console.log(error);
    return { isValid: false };
  }
};
