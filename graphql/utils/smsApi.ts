import axios from 'axios';
import addMinutes from 'date-fns/addMinutes';
import { utcToZonedTime } from 'date-fns-tz';
// import format from 'date-fns/format';
import * as Sentry from '@sentry/node';
import { Context } from 'graphql/context';

import { PHONE_CODE_EXPIRY } from './constants';

export default async function sendSms(
  phone: string,
  message: string,
  shortNumber: boolean,
  phoneVerificationId: number | null,
  ctx: Context
): Promise<boolean> {
  // if (phone.length > 10) {
  //   return false;
  // }

  const date = addMinutes(new Date(), PHONE_CODE_EXPIRY);
  const ba_time = utcToZonedTime(date, 'America/Buenos_Aires');
  //const expiresAt = format(ba_time, 'yyyy-MM-dd HH:mm:ss');
  const headers = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SMS_TOKEN}`,
    },
  };
  const options: any = {
    recipient: phone,
    message: message,
    //expires_at: expiresAt,
    ignore_banned: 1,
    service_id:
      shortNumber && process.env.CAUDA_SHORT_SMS_ENABLED === '1' ? 130 : 78,
  };

  try {
    const res = await axios.post(
      'https://api.notimation.com/api/v1/sms',
      options,
      headers
    );

    const isSuccess = res.data.status === 'success';

    console.log(`SMS sent to phone: ${phone}`, JSON.stringify(res.data));

    await ctx.prisma.sms.create({
      data: {
        smsId: isSuccess ? res.data.data.sms_id.toString() : null,
        phoneVerificationId: phoneVerificationId || null,
        error: isSuccess ? null : res.data.message,
      },
    });

    return isSuccess;
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return false;
  }
}
