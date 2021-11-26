import superAdminReferersAtom from './atom';
import { selector } from 'recoil';
import { catchAxiosErrors, getToken } from '../../../utils';
import { getRequest } from '../../../utils/axiosClient';


const withSuperAdminReferersQuery = selector({
  key: 'withSuperAdminReferersQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/super_admin/get-user-who-referenced-park`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Referers Atom State: ', get(superAdminReferersAtom));
        console.log('Actual Data: ', data?.users);
        return data?.users || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newReferer) => {
    set(superAdminReferersAtom, [...get(superAdminReferersAtom), newReferer]);
  },
});

export default withSuperAdminReferersQuery;
