import { Fragment, Suspense } from 'react';
import LoadScripts from '../../Hooks/loadScripts';
import { SuperAdminAddBankDetails } from '../../components/SuperPartials';
import { GridCards } from '../../components/Skeletons';
import { SuperAdminBankDetailsPartial } from '../../components/SuperPartials';
import './SuperAdminBankDetails.css';

const SuperAdminBankDetails = () => {

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
        <h4 className="text-uppercase fs-5 overline m-0">Your Bank Details</h4>
        <SuperAdminAddBankDetails />
      </div>

      <Suspense fallback={<GridCards 
        cardHeight={220}
        cardEffect={`fade`}
        cardRadius={15}  
      />}>
        <SuperAdminBankDetailsPartial />
      </Suspense>
    </Fragment>
  );
}

export default SuperAdminBankDetails;
