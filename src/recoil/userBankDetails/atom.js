import { atom } from "recoil";
import persistAtom from "../persistRecoil";

const userBankDetailsAtom = atom({
  key: 'userBankDetailsAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default userBankDetailsAtom;