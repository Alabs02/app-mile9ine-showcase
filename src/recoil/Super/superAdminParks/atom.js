import { atom } from "recoil";
import persistAtom from "../../persistRecoil";

const superAdminParksAtom = atom({
  key: 'superAdminParksAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default superAdminParksAtom;