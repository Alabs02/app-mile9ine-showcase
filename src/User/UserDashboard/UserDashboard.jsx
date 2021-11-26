import { Fragment, Suspense, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { withUser } from '../../recoil/parkUser';
import LoadScripts from '../../Hooks/loadScripts';
import { BookRide, UserRequestPayout, CompletedCheckout } from '../../components/UserPartials';
import _ from 'lodash';
import './UserDashboard.css';

const UserDashboard = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  const userDetails = useRecoilValue(withUser);
  
  return (
    <Fragment>
      <div className="d-app-flex m-0 mb-3">
        <h4 className="saluation salutation__overline m-0">Hey {_.split(_.get(userDetails, 'name', null), ' ', 1)}, Welcome Back!</h4>
        <UserRequestPayout />
      </div>

      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <BookRide />
        <CompletedCheckout />
      </Suspense>
    </Fragment>
  );
}

export default UserDashboard;
