import userBeneficiariesAtom from './atom';
import { selector } from "recoil";
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";

const withBeneficiaryQuery = selector({
  key: 'withBeneficiaryQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_user/get-beneficaries`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Beneficiary State: ', get(userBeneficiariesAtom));
        console.log('Actual Data: ', data?.beneficaries);

        return data?.beneficaries || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newBeneficiary) => {
    set(userBeneficiariesAtom, [...get(userBeneficiariesAtom), newBeneficiary]);
  },
});

export default withBeneficiaryQuery;