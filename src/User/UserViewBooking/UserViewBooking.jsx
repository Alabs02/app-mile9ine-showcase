import { Fragment, Suspense } from 'react';
import LoadScripts from '../../Hooks/loadScripts';
import { GridCards } from '../../components/Skeletons';
import { ViewBookedRidePartial } from '../../components/UserPartials';
import './UserViewBooking.css';

const UserViewBooking = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");


  return (
    <Fragment>
      <div className="d-app-flex mb-3">
        <h4 className="saluation salutation__overline m-0 letter__wide text-uppercase">Booked Rides</h4>
      </div>

      <Suspense
        fallback={<GridCards
          cardHeight={200}
          cardRadius={20} 
          cardEffect={`fade`}
        />}
      >
        <ViewBookedRidePartial />
      </Suspense>      
    </Fragment>
  );
}

export default UserViewBooking
