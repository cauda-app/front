import { parseAndValidate } from '../../src/utils/phone-utils';

export default async (req, res) => {
  const isValid = parseAndValidate('AR', req.query.number); // TODO: Fixed for Argentina

  res.status(200).json({ isValid });
};
