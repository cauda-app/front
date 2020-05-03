import { ShopDetails } from './../../graphql.d';
import { ShopDetails as PrismaShopDetails } from '@prisma/client';

import {
  nowFromCoordinates,
  todayIs,
  isOpen as IsOpenHelper,
} from 'src/utils/dates';
import { parseUTCTime } from 'src/utils/dates';
import { parsePhone } from 'src/utils/phone-utils';

const todaysStatus = (shopDetails: ShopDetails | PrismaShopDetails) => {
  const now = nowFromCoordinates(shopDetails.lat, shopDetails.lng);
  const today = todayIs(now).toLowerCase();
  const timeStart: string = shopDetails[today + 'TimeStart'];
  const timeEnd: string = shopDetails[today + 'TimeEnd'];
  if (!timeStart || !timeEnd) {
    return null;
  }

  return { start: timeStart, end: timeEnd, now };
};

export const isOpen = (shopDetails: ShopDetails | PrismaShopDetails) => {
  const status = todaysStatus(shopDetails);
  if (!status) {
    return false;
  }
  const open = parseUTCTime(status.start, status.now);
  const close = parseUTCTime(status.end, status.now);

  return IsOpenHelper(status.now, open, close);
};

export const shopPhone = (shopDetails: ShopDetails | PrismaShopDetails) => {
  if (shopDetails.shopPhone) {
    const phone = parsePhone(shopDetails.shopPhone);
    return phone.number;
  }

  return null;
};

export const status = (shopDetails: ShopDetails | PrismaShopDetails) => {
  const status = todaysStatus(shopDetails);
  if (!status) {
    return null;
  }

  return { opens: status.start, closes: status.end };
};
