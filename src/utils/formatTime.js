export const formatTime = (dStr) => {
  if (dStr !== (undefined || null) && typeof dStr === 'string') {
    let AmOrPm = +dStr.substr(0, dStr.indexOf(':')) >= 12 ? "PM" : "AM";
    return `${dStr} ${AmOrPm}`;
  } else {
    return time;
  }
}
