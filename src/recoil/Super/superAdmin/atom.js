import { atom } from "recoil";
import persistAtom from "../../persistRecoil";

const superAdminAtom = atom({
  key: 'superAdminAtom',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export default superAdminAtom;