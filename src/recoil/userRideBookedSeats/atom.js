import { atom } from "recoil";
import persistAtom from '../persistRecoil';

const userRideBookedSeatsAtom = atom({
  key: 'userRideBookedSeatsAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default userRideBookedSeatsAtom;