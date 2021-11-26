import { atom } from "recoil";
import persistAtom from "../../persistRecoil";

const superAdminReferersAtom = atom({
  key: 'superAdminReferersAtom',
  default: [],
  effects_UNSTABLE: [persistAtom]
});

export default superAdminReferersAtom;