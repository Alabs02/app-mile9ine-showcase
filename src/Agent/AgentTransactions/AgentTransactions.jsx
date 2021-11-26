import { Fragment, Suspense } from 'react';
import { TableLoader } from '../../components/Skeletons';
import { AgentTransactionsPartial } from '../../components/AgentPartials';
import LoadScripts from '../../Hooks/loadScripts';

const AgentTransactions = () => {
  
  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");
  LoadScripts("https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js");
  LoadScripts("https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js")

  return (
    <Fragment>
      <div className="d-app-flex mb-3">
        <h4 className="text-uppercase fs-5 overline m-0">Agent Transactions</h4>
      </div>

      <Suspense fallback={<TableLoader />}>
        <AgentTransactionsPartial />
      </Suspense>
    </Fragment>
  );
}

export default AgentTransactions;
