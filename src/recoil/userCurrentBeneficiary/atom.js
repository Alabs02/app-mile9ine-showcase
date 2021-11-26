import { atom } from "recoil";
import persistAtom from '../persistRecoil';

const userCurrentBeneficiaryAtom = atom({
  key: 'userCurrentBeneficiaryAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export default userCurrentBeneficiaryAtom;