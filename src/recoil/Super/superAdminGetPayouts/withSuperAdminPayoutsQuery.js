import superAdminGetPayoutsAtom from './atom';
import { selector } from "recoil";
import { catchAxiosErrors, getToken } from '../../../utils';
import { getRequest } from '../../../utils/axiosClient';

const withSuperAdminPayoutsQuery = selector({
  key: 'withSuperAdminPayoutsQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/super_admin/get-bank-details`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Payouts Atom State: ', get(superAdminGetPayoutsAtom));
        console.log('Actual Data: ', data?.payouts);
        return data?.payouts || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newPayout) => {
    set(superAdminGetPayoutsAtom, [...get(superAdminGetPayoutsAtom), newPayout]);
  },
});

export default withSuperAdminPayoutsQuery;