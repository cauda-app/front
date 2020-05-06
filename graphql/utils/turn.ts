export const numberToTurn = (number: Number) => {
  const numberPadded = number.toString().padStart(3, '0');

  const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const turn = numberPadded.slice(-3);

  return `${letter[Number(turn.slice(0, 1))]}${turn.slice(-2)}`;
};
