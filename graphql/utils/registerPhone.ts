import addMinutes from 'date-fns/addMinutes';

import randomCode from '../../graphql/utils/randomCode';
import { Context } from '../context';
import { PHONE_CODE_EXPIRY } from '../utils/constants';

export function registerPhone(phone: string, ctx: Context) {
  return ctx.prisma.phoneVerification.create({
    data: {
      code: randomCode(),
      phone: phone,
      expiry: addMinutes(new Date(), PHONE_CODE_EXPIRY).toISOString(),
    },
  });
}
