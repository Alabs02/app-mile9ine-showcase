import { selector } from "recoil";
import { catchAxiosErrors } from "../../utils";
import { getRequest } from "../../utils/axiosClient";
import getAllParksAtom from "./atom";

const withParksQuery = selector({
  key: 'withParksQuery',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park/get-parks-and-rides`);

      if (data) {
        console.log(data, status, statusText);
        console.log('Parks Atom State: ', get(getAllParksAtom));
        console.log('Actual Data: ', data?.data);
        return data?.data || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({set}, newValue) => set(getAllParksAtom, newValue),
});

export default withParksQuery;