import { atom } from "recoil";
import persistAtom from "../persistRecoil";

const getUserTypeAtom = atom({
  key: 'getUserTypeAtom',
  default: null,
  effects_UNSTABLE: [persistAtom]
});

export default getUserTypeAtom;