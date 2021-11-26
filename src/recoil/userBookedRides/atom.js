import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const userBookedRidesAtom = atom({
  key: 'userBookedRidesAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default userBookedRidesAtom;