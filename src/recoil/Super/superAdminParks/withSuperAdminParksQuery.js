import { selector } from 'recoil';
import superAdminParksAtom from './atom';
import { catchAxiosErrors, getToken } from '../../../utils';
import { getRequest } from '../../../utils/axiosClient';

const withSuperAdminParksQuery = selector({
  key: 'withSuperAdminParksQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/super_admin/get-parks`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Parks Atom State: ', get(superAdminParksAtom));
        console.log('Actual Data: ', data?.data);
        return data?.data || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newPark) => {
    set(superAdminParksAtom, [...get(superAdminParksAtom), newPark]);
  },
});

export default withSuperAdminParksQuery;