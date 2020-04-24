import jwt from 'jsonwebtoken';

export const createToken = (userId: string | number) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '14d' }
  );
};

export const verifyToken = (
  token: any
): { isValid: boolean; userId?: string | number } => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      isValid: true,
      userId: decoded.userId,
    };
  } catch (error) {
    console.log(error);
    return { isValid: false };
  }
};
