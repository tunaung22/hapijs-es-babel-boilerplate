
export default (min, max) => {
  const result = Math.random() * (max - min) + 1;
  return result;
};
