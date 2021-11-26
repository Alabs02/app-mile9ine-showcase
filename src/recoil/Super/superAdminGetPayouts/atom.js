import { atom } from 'recoil';
import persistAtom from '../../persistRecoil';

const superAdminGetPayoutsAtom = atom({
  key: 'superAdminGetPayoutsAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default superAdminGetPayoutsAtom;