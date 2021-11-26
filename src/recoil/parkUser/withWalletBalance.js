import parkUserAtom from './atom';
import { pick, isEmpty } from 'lodash';
import { selector } from 'recoil';

const withWalletBalance = selector({
  key: 'withWalletBalance',
  get: ({get}) => {
    const data = get(parkUserAtom);

    if (isEmpty(data)) {
      return {};
    }

    return pick(data?.user_profile, [
      'id',
      'user_id',
      'user_wallet',
    ]);
  },
  set: ({set}, newValue) => set(parkUserAtom, newValue),
});

export default withWalletBalance;