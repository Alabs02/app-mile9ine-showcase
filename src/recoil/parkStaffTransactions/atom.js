import { atom } from "recoil";
import persistAtom from "../persistRecoil";

const parkStaffTransactionsAtom = atom({
  key: 'parkStaffTransactionsAtom',
  default: [],
  effects_UNSTABLE: [persistAtom]
});

export default parkStaffTransactionsAtom;