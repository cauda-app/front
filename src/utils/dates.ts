import format from 'date-fns/format';
import parse from 'date-fns/parse';
import isWithinInterval from 'date-fns/isWithinInterval';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import tzLookup from 'tz-lookup';

export const parseUTCTime = (time, date) => parse(time, "HH:mm:ss'Z'", date);

const curriedFormat = (stringFormat) => (date) => format(date, stringFormat);

export const formats = {
  hourMinute: curriedFormat('h:mma'),
};

export const isOpen = (date, start, end) =>
  isWithinInterval(date, {
    start,
    end,
  });

type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export const todayIs = (date: Date): WeekDay => format(date, 'EEEE') as WeekDay;

export const nowFromCoordinates = (lat: number, lng: number): Date => {
  const date = new Date().toISOString();
  const timeZone = tzLookup(lat, lng);
  return utcToZonedTime(date, timeZone);
};

export const serializeTime = (date: Date): string => {
  const dateTimeString = date.toISOString();
  let time = dateTimeString.substr(dateTimeString.indexOf('T') + 1);
  const regexFracSec = /\.\d{1,}/;
  time = time.replace(regexFracSec, '');
  return time;
};

export const formattedTimeDifference = (timeInFuture: Date): string | null => {
  let now = new Date();
  if (timeInFuture > now) {
    const totalSeconds = differenceInSeconds(timeInFuture, +Date.now());
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedDif = `${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedDif;
  }
  return null;
};

export const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
