export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

export const random = (from, to) => {
  if(to < from) throw new Error("Invalid value");
  return Math.floor(Math.random() * (to - from + 1) + from);
}

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
