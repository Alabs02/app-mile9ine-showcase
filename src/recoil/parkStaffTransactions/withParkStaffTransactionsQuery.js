import { selector } from "recoil";
import parkStaffTransactionsAtom from './atom';
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withParkStaffTransactionsQuery = selector({
  key: 'withParkStaffTransactionsQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_agent/get-agent-transactions`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Staff Transaction State: ', get(parkStaffTransactionsAtom));
        console.log('Actual Data: ', data?.booking_transactions);

        return data?.booking_transactions || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newTransaction) => {
    set(parkStaffTransactionsAtom, [...get(parkStaffTransactionsAtom), newTransaction]);
  },
});

export default withParkStaffTransactionsQuery;