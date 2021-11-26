import { atom } from "recoil";
import persistAtom from "../../persistRecoil";

const superGetParksCountAtom = atom({
  key: 'superGetParksCountAtom',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export default superGetParksCountAtom;