import userBankDetailsAtom from './atom';
import { selector } from 'recoil';
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withUserBankDetailsQuery = selector({
  key: 'withUserBankDetailsQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_user/get-bank-details`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Bank State: ', get(userBankDetailsAtom));
        console.log('Actual Data: ', data?.bank_details);

        return data?.bank_details || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newBankDetails) => {
    set(userBankDetailsAtom, [...get(userBankDetailsAtom), newBankDetails]);
  },
});

export default withUserBankDetailsQuery;