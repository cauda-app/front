import axios from 'axios';

export default async function validateCaptcha(token) {
  const res = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret: process.env.RE_CAPTCHA_SECRET,
        response: token,
      },
    }
  );

  const captchaValidation = res.data;
  if (
    !captchaValidation.success ||
    captchaValidation.score < 0.7 ||
    (process.env.NODE_ENV === 'production' &&
      captchaValidation.hostname === 'localhost')
  ) {
    return false;
  }

  return true;
}
