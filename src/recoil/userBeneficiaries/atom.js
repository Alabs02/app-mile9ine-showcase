import { atom } from 'recoil';
import persistAtom from '../persistRecoil';

const userBeneficiariesAtom = atom({
  key: 'userBeneficiariesAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export default userBeneficiariesAtom;