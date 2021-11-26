import parkUserAtom from './atom';
import { pick, isEmpty } from 'lodash';
import { selector } from 'recoil';

const withUser = selector({
  key: 'withUser',
  get: ({get}) => {
    const data = get(parkUserAtom);

    if (isEmpty(data)) {
      return {};
    }

    return pick(data, [
      'id',
      'email',
      'is_email_verified',
      'name',
      'type',
      'email_verified_at'
    ]);
  },
  set: ({set}, newValue) => set(parkUserAtom, newValue),
});

export default withUser;