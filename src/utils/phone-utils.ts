//const PNF = require('google-libphonenumber').PhoneNumberFormat;
//const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
//const PhoneNumberType = require('google-libphonenumber').PhoneNumberType;

import {
  PhoneNumberUtil,
  PhoneNumberType,
  PhoneNumberFormat as PNF,
  PhoneNumber,
} from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

const isMobilePhoneNumber = (phoneNumber) =>
  phoneUtil.getNumberType(phoneNumber) === PhoneNumberType.MOBILE;

const isValid = (parsedNumber: PhoneNumber, region?: string): boolean => {
  if (!region) {
    region = phoneUtil.getRegionCodeForNumber(parsedNumber);
  }

  return (
    phoneUtil.isPossibleNumber(parsedNumber) &&
    phoneUtil.isValidNumber(parsedNumber) &&
    phoneUtil.isValidNumberForRegion(parsedNumber, region)
  );
};

export const parsePhone = (rawNumber: string) => {
  try {
    const number = phoneUtil.parse(rawNumber);

    if (!isValid(number)) {
      throw Error(`Phone number ${rawNumber} is invalid`);
    }

    const countryCode = phoneUtil.getRegionCodeForNumber(number);
    const formattedNumber: string = (phoneUtil as any).formatInOriginalFormat(
      number
    );
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

export const getNationalNumber = (rawNumber: string): string | undefined => {
  try {
    const number = phoneUtil.parse(rawNumber);

    if (!isValid(number)) {
      throw Error(`Phone number ${rawNumber} is invalid`);
    }

    const nationalNumber = number.getNationalNumber();
    if (!!nationalNumber) {
      return;
    }

    const nationNumberString = nationalNumber!.toString();
    if (number.getCountryCode() === 54 && nationNumberString[0] === '9') {
      return nationNumberString.slice(1, nationNumberString.length);
    }
  } catch (error) {
    console.log(error);
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
