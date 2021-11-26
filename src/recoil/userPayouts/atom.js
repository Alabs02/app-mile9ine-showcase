import { atom } from "recoil";
import persistAtom from "../persistRecoil";

const userPayoutsAtom = atom({
  key: 'userPayoutsAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default userPayoutsAtom;