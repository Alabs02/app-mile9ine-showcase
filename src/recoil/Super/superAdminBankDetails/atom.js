import { atom } from "recoil";
import persistAtom from "../../persistRecoil";

const superAdminBankDetailsAtom = atom({
  key: 'superAdminBankDetailsAtom',
  default: [],
  effects_UNSTABLE: [persistAtom]
});

export default superAdminBankDetailsAtom;