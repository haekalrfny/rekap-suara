export const calculatePercentage = (current, total) => {
  if (total === 0) return 0;
  return (current / total) * 100;
};
