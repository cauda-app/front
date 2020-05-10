import Hashids from 'hashids/cjs';

const hashids = new Hashids(
  process.env.HASHIDS_SALT || 'Cauda Web',
  6, // padding
  'abcdefghijklmnopqrstuvwxyz1234567890' // alphabet
);

export const encodeId = (id?: number): string => (id ? hashids.encode(id) : '');
export const decodeId = (id?: string): number | bigint | null =>
  id ? hashids.decode(id)[0] : null;
