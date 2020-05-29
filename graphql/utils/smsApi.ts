import axios from 'axios';
import addMinutes from 'date-fns/addMinutes';
import { utcToZonedTime } from 'date-fns-tz';
import format from 'date-fns/format';
import * as Sentry from '@sentry/node';

import { PHONE_CODE_EXPIRY } from './constants';

export default async function sendSms(
  phone: string,
  message: string
): Promise<boolean> {
  if (phone.length > 10) {
    return false;
  }

  const date = addMinutes(new Date(), PHONE_CODE_EXPIRY);
  const ba_time = utcToZonedTime(date, 'America/Buenos_Aires');
  const expiresAt = format(ba_time, 'yyyy-MM-dd HH:mm:ss');

  try {
    const res = await axios.post(
      'https://api.notimation.com/api/v1/sms',
      {
        recipient: phone,
        message: message,
        expiresAt,
        ignore_banned: 1,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SMS_TOKEN}`,
        },
      }
    );
    console.log(`SMS sent to phone: ${phone}`);
    return res.data.status === 'success';
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
    return false;
  }
}
