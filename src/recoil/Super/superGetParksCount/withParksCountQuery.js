import { selector } from 'recoil';
import superGetParksCountAtom from './atoms';
import { catchAxiosErrors, getToken } from '../../../utils';
import { getRequest } from '../../../utils/axiosClient';

const withParksCountQuery = selector({
  key: 'withParksCountQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/super_admin/get-all-parks-number`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Parks count Atom State: ', get(superGetParksCountAtom));
        console.log('Actual Data: ', data?.data);
        return data?.data || 0;
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({set}, newValue) => set(myAtom, newValue),
});

export default withParksCountQuery;