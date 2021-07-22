export const zeroPadding = (num, len) => {
  return (`${Array(len).join('0')}${num}`).slice(-len);
}

