import superAdminBankDetailsAtom from './atom';
import { selector } from 'recoil';
import { catchAxiosErrors, getToken } from '../../../utils';
import { getRequest } from '../../../utils/axiosClient';

const withSuperAdminBankDetailsQuery = selector({
  key: 'withSuperAdminBankDetailsQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/super_admin/get-bank-details`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Bank Atom State: ', get(superAdminBankDetailsAtom));
        console.log('Actual Data: ', data?.bank_details);
        return data?.bank_details || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newBankDetails) => {
    set(superAdminBankDetailsAtom, [...get(superAdminBankDetailsAtom), newBankDetails]);
  },
});

export default withSuperAdminBankDetailsQuery;