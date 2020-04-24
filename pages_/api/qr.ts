export default async (req, res) => {
  await sleep(5000);
  res.status(200).json({ url: '/' });
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
