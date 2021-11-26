import { Fragment, Suspense } from 'react';
import LoadScripts from '../../Hooks/loadScripts';
import { UserPayoutsPartial } from '../../components/UserPartials';
import { GridCards } from '../../components/Skeletons';
import './UserPayouts.css';

const UserPayouts = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  return (
    <Fragment>
      <div className="d-app-flex m-0 mb-3">
        <h4 className="saluation salutation__overline m-0 letter__wide text-uppercase">My Payouts</h4>
      </div>

      <Suspense fallback={<GridCards 
        cardHeight={240}
        cardEffect={`fade`}
        cardRadius={20}
      />}>
        <UserPayoutsPartial />
      </Suspense>
    </Fragment>
  );
}

export default UserPayouts;
