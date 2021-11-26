const stringSeparator = (string='00') => {
  let newStrArr = [];
  if (string !== (null || undefined)) {
    let strLen = string.length;
    for (let i = 0; i < strLen-1; i++) {
      newStrArr.push(string.substr(i, 1+i));
    }
    return newStrArr.toString();
  }
};

export default stringSeparator;
