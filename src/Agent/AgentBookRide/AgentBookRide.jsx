import { Fragment } from 'react';
import LoadScripts from '../../Hooks/loadScripts';
import { useRecoilState } from 'recoil';
import { BookRide } from '../../components/UserPartials';
import _ from 'lodash';
import './AgentBookRide';

const AgentBookRide = () => {

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
        <h4 className="saluation salutation__overline m-0">Book Customers</h4>
      </div>

      <BookRide />

    </Fragment>
  );
}

export default AgentBookRide;
