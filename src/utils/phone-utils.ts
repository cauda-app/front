const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PhoneNumberType = require('google-libphonenumber').PhoneNumberType;

export const parsePhone = (rawNumber: string) => {
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

export const getNationalNumber = (rawNumber: string) => {
  try {
    const number = phoneUtil.parse(rawNumber);

    if (!isValid(number)) {
      throw Error(`Phone number ${rawNumber} is invalid`);
    }

    return number.getNationalNumber();
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const formatPhone = (countryCode: string, number: string): string => {
  let parsedNumber = phoneUtil.parse(number, countryCode);

  // https://github.com/google/libphonenumber/blob/master/FAQ.md#why-is-this-number-from-argentina-ar-or-mexico-mx-not-identified-as-the-right-number-type
  if (!isMobilePhoneNumber(parsedNumber)) {
    let nationalNumber = '9' + parsedNumber.getNationalNumber();
    let newNumber = phoneUtil.parse(nationalNumber, countryCode);
    if (isMobilePhoneNumber(newNumber)) {
      parsedNumber = newNumber;
    }
  }

  return phoneUtil.format(parsedNumber, PNF.E164);
};

const isMobilePhoneNumber = (phoneNumber) =>
  phoneUtil.getNumberType(phoneNumber) === PhoneNumberType.MOBILE;

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
