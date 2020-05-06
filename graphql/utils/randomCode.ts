export default function randomCode() {
  const min = Math.ceil(1000);
  const max = Math.floor(9999);

  return min + Math.floor((max - min) * Math.random());
}
