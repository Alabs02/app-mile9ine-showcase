import { selector } from "recoil";
import { catchAxiosErrors, getToken } from "../../utils";
import { getRequest } from "../../utils/axiosClient";
import userBookedRidesAtom from "./atom";


const withUserBookedRides = selector({
  key: 'withUserBookedRides',
  get: async ({get}) => {
    try {
      const { data, status, statusText } = await getRequest(`/park_user/get-all-bookings`, {
        headers: { authorization: `Bearer ${ await getToken() }` }
      });

      if (data) {
        console.log(data, status, statusText);
        console.log('Booked Rides State: ', get(userBookedRidesAtom));
        console.log('Actual Data: ', data?.data);

        return data?.data || [];
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  },
  set: ({ set, get }, newBookedRide) => {
    set(userBookedRidesAtom, [...get(userBookedRidesAtom), newBookedRide]);
  },
});

export default withUserBookedRides;