import { atom } from "recoil";
import persistAtom from "../persistRecoil";

const getAllBanksAtom = atom({
  key: 'getAllBanksAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default getAllBanksAtom;