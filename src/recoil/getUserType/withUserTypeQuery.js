import { selector } from "recoil";
import getUserTypeAtom from './atom';
import { localForage } from '../../services';
import _ from 'lodash';

const withUserTypeQuery = selector({
  key: 'withUserTypeQuery',
  get: async ({get}) => {
    const userCredentials = await localForage.getItem('credentials');
    if (!_.isNull(userCredentials)) {
      return userCredentials?.type;
    } else {
      return null;
    }
  },
  set: ({set}, newValue) => set(getUserTypeAtom, newValue),
});

export default withUserTypeQuery;