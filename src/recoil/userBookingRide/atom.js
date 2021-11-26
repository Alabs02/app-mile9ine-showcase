import { atom } from "recoil";
import persistAtom from '../persistRecoil';

const userBookingRideAtom = atom({
  key: 'userBookingRideAtom',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export default userBookingRideAtom;