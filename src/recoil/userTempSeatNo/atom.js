import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const userTempSeatNoAtom = atom({
  key: 'userTempSeatNoAtom',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export default userTempSeatNoAtom;