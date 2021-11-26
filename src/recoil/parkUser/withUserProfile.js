import parkUserAtom from './atom';
import { pick, isEmpty } from 'lodash';
import { selector } from 'recoil';

const withUserProfile = selector({
  key: 'withUserProfile',
  get: ({get}) => {
    const data = get(parkUserAtom);

    if (isEmpty(data)) {
      return {};
    }

    return pick(data?.user_profile, [
      'id',
      'address',
      'contact',
      'next_kin_address',
      'next_kin_contact',
      'next_kin_name',
      'ref',
      'user_id',
      'gender'
    ]);
  },
  set: ({set}, newValue) => set(parkUserAtom, newValue),
});

export default withUserProfile;