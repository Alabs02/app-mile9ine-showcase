import userPayoutsAtom from './atom';
import { selector } from 'recoil';

const withUserPayoutsQuery = selector({
  key: 'withUserPayoutsQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_user/get-all-payout`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Payouts State: ', get(userBankDetailsAtom));
        console.log('Actual Data: ', data?.payouts);

        return data?.payouts || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newPayout) => {
    set(userPayoutsAtom, [...get(userPayoutsAtom), newPayout]);
  },
});

export default withUserPayoutsQuery;