import _ from 'lodash';

const checkGender = (gender) => {
  if (
    gender !== (undefined || null)
    && _.toLower(gender) === 'male'
  ) {
    return "/images/male.svg";
  } else if (
    gender !== (undefined || null)
    && _.toLower(gender) === 'female'
  ) {
    return "/images/female.svg"
  } else if (gender === (undefined || null)) {
    return "/images/male.svg";
  }
}

export default checkGender;