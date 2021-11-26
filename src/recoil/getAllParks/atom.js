import { atom } from "recoil";
import persistAtom from '../persistRecoil';

const getAllParksAtom = atom({
  key: 'getAllParksAtom',
  default: [],
  effects_UNSTABLE: [persistAtom]
});

export default getAllParksAtom;