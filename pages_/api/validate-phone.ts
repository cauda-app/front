import { parseAndValidate } from '../../src/utils/phone-utils';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async (req, res) => {
  await sleep(10000);

  const isValid = parseAndValidate('AR', req.query.number); // TODO: Fixed for Argentina

  res.status(200).json({ isValid });
};
