import { atom } from "recoil";
import persistAtom from '../persistRecoil';

const userFareAmtAtom = atom({
  key: 'userFareAmtAtom',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export default userFareAmtAtom;