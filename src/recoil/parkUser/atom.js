import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const parkUserAtom = atom({
  key: 'parkUserAtom',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export default parkUserAtom;