import { Fragment, Suspense } from 'react';
import { SuperAdminPayoutsPartial } from '../../components/SuperPartials';
import { TableLoader } from '../../components/Skeletons';
import './SuperAdminPayouts.css';

const SuperAdminPayouts = () => {
  return (
    <Fragment>
      <div className="d-app-flex mb-3">
        <h4 className="text-uppercase fs-5 overline m-0">All Payouts</h4>
      </div>

      <Suspense fallback={<TableLoader />}>
        <SuperAdminPayoutsPartial />
      </Suspense>
    </Fragment>
  );
}

export default SuperAdminPayouts;
