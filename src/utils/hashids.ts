import Hashids from 'hashids/cjs';

const padding = 6;
const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';

const hashids = new Hashids(
  process.env.HASHIDS_SALT || 'Cauda Web',
  padding,
  alphabet
);

export const encodeId = (id?: number): string => (id ? hashids.encode(id) : '');

export const decodeId = (id?: string): number | null =>
  id ? (hashids.decode(id)[0] as number | null) : null;

export const encodeValue = (value: number, secret: string): string => {
  const hashids = new Hashids(secret, padding, alphabet);
  return hashids.encode(value);
};
