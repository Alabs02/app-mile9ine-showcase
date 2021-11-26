import { atom } from "recoil";
import persistAtom from '../persistRecoil';

const userAvailableSeatsAtom = atom({
  key: 'userAvailableSeatsAtom',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export default userAvailableSeatsAtom;