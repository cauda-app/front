const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export const parse = (rawNumber: string) => {
  try {
    const number = phoneUtil.parse(rawNumber);

    if (!isValid(number)) {
      throw Error(`Phone number ${rawNumber} is invalid`);
    }

    const countryCode: string = phoneUtil.getRegionCodeForNumber(number);
    const formattedNumber: string = phoneUtil.formatInOriginalFormat(number);
    const fullNumber: string = phoneUtil.format(number, PNF.INTERNATIONAL);

    return {
      countryCode: String(countryCode),
      number: formattedNumber,
      fullNumber,
    };
  } catch (error) {
    return {
      countryCode: '',
      number: rawNumber,
      fullNumber: rawNumber,
    };
  }
};

export const format = (countryCode: string, number: string): string => {
  const parsedNumber = phoneUtil.parse(number, countryCode);

  return phoneUtil.format(parsedNumber, PNF.E164);
};

const isValid = (parsedNumber: string, region?: string): boolean => {
  if (!region) {
    region = phoneUtil.getRegionCodeForNumber(parsedNumber);
  }

  return (
    phoneUtil.isPossibleNumber(parsedNumber) &&
    phoneUtil.isValidNumber(parsedNumber) &&
    phoneUtil.isValidNumberForRegion(parsedNumber, region)
  );
};

export const parseAndValidate = (
  countryCode: string,
  number: string
): boolean => {
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(number, countryCode);

    return isValid(parsedNumber, countryCode);
  } catch (error) {
    return false;
  }
};
