import jwt from 'jsonwebtoken';

import { TOKEN_EXPIRY } from '../utils/constants';

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
    process.env.JWT_SECRET,
    { expiresIn: `${TOKEN_EXPIRY}d` }
  );
};

export const verifyToken = (
  token: any
): { isValid: boolean; clientId?: number; shopId?: string, phone?: string } => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      isValid: true,
      ...decoded,
    };
  } catch (error) {
    console.log(error);
    return { isValid: false };
  }
};
