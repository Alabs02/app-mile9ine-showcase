import { Fragment, Suspense } from 'react';
import { SuperAdminManageParksPartial } from '../../components/SuperPartials';
import { TableLoader } from '../../components/Skeletons';
import LoadScripts from '../../Hooks/loadScripts';
import './SuperAdminManageParks.css';

const SuperAdminManageParks = () => {

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
        <h4 className="text-uppercase fs-5 overline m-0">Manage Parks</h4>
      </div>

      <Suspense fallback={<TableLoader />}>
        <SuperAdminManageParksPartial />
      </Suspense>
    </Fragment>
  );
}

export default SuperAdminManageParks;
