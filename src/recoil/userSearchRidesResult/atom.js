import { atom } from 'recoil';
import persistAtom from '../persistRecoil'; 

const userSearchRidesResultAtom = atom({
  key: 'userSearchRidesResultAtom',
  default: [],
  effects_UNSTABLE: [persistAtom]
});

export default userSearchRidesResultAtom;