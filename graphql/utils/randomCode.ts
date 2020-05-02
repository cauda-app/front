export default function randomizeInteger() {
  if (process.env.SMS_VERIFICATION_ENABLED === '1') {
    const min = Math.ceil(1000);
    const max = Math.floor(9999);

    return min + Math.floor((max - min) * Math.random());
  } else {
    return 1234;
  }
}
