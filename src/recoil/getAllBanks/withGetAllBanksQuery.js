import getAllBanksAtom from './atom';
import { selector } from "recoil";
import { catchAxiosErrors } from '../../utils';
import { getRequest } from '../../utils/axiosClient';

const withGetAllBanksQuery = selector({
  key: 'withGetAllBanksQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/get-banks`);

      if (data) {
        console.log(data, status, statusText);
        console.log('All Banks Atom State: ', get(getAllBanksAtom));
        console.log('Actual Data: ', data?.data);
        return data?.data || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({set, get}, newValue) => set([...get(getAllBanksAtom), newValue]),
});

export default withGetAllBanksQuery;