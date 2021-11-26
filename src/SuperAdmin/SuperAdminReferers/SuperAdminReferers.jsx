import { Fragment, Suspense } from 'react';
import LoadScripts from '../../Hooks/loadScripts';
import { SuperAdminReferersPartial } from '../../components/SuperPartials';
import { GridCards } from '../../components/Skeletons';

import './SuperAdminReferers.css';


const SuperAdminReferers = () => {

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
        <h4 className="text-uppercase fs-5 overline m-0">Referers</h4>
      </div>

      <Suspense fallback={<GridCards 
        cardEffect={`fade`}
        cardHeight={200}
        cardRadius={15}
      />}>
        <SuperAdminReferersPartial />
      </Suspense>
    </Fragment>
  )
}

export default SuperAdminReferers;
