import { Fragment, Suspense, useState } from 'react';
import LoadScripts from '../../Hooks/loadScripts';
import SuperAdminPayouts from '../SuperAdminPayouts';
import { GiMoneyStack } from 'react-icons/gi';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, number } from 'yup'; 
import { TextField } from '../../components/FormField';
import { catchAxiosErrors, transformToFormData, getToken } from '../../utils';
import { useRecoilState } from 'recoil';
import { withSuperAdminPayoutsQuery, superAdminGetPayoutsAtom } from '../../recoil/Super/superAdminGetPayouts';
import { superAdminAtom } from '../../recoil/Super/superAdmin';
import { SuperAdminParkMonthlyFunds, ParksCount } from '../../components/SuperPartials';
import { SkeletonBlock } from 'skeleton-elements/react';

import './SuperAdminDashboard.css';
import { toast } from 'react-toastify';

const initialFormValues = () => {
  return {
    amount: 0,
  }
}

const requestPayoutSchema = object().shape({
  amount: number()
    .min(100, 'You can only withdraw a minimum of 100!')
    .required('Required!'),
});

const SuperAdminDashboard = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  const [isLoading, setIsLoading] = useState(false);
  const [payouts, setPayouts] = useRecoilState(superAdminGetPayoutsAtom);
  const [superAdmin, setSuperAdmin] = useRecoilState(superAdminAtom);
  
  return (
    <Fragment>
      <div className="d-app-flex mb-3">
        <h4 className="text-uppercase fs-5 overline m-0">My Dashboard</h4>

        <span data-toggle="modal" data-target="#modalRequest" className="add-menu-sidebar add__btn">
          <GiMoneyStack size={23} className=" text-white mr-2" />
          <span>Request Payout</span>
        </span>

        <div className="modal fade" id="modalRequest" tabIndex={-1} aria-labelledby="modalRequestLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Payout</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <AiOutlineCloseCircle />
                </button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={initialFormValues()}
                  validationSchema={requestPayoutSchema}
                  onSubmit={async (values, { resetForm }) => {
                    try {
                      setIsLoading(true);
                      const { data, status, statusText } = await postRequest(`/super_admin/request-cash-transfer`, transformToFormData(values), {
                        headers: { authorization: `Bearer ${await getToken()}` }
                      });

                      if (data) {
                        console.log(data, status, statusText);
                        setSuperAdmin(data.data);
                        setPayouts([...payouts, {}]);
                        setIsLoading(false);
                        toast.success(`Payout Successfully!`);
                        resetForm();
                      }
                    } catch (err) {
                      catchAxiosErrors(err, setIsLoading, null);
                    }
                  }}
                >
                  {props => (
                    <Form>
                      <div className="row text-left">
                        <div className="col-sm-12">
                          <label htmlFor="amount" className="text-label fs-5 m-0">Amount</label>
                          <Field name="amount" type="number" as={TextField} placeholder="e.g 100" />
                          <ErrorMessage name="amount">
                            {msg => <div className="error-msg text-danger">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger light" data-dismiss="modal">Close</button>
                { isLoading
                  ? <div className="text-muted d-flex justify-content-centers">Requesting...</div>
                  : <button type="submit" className="btn btn-primary">Request</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-4">
        <Suspense fallback={`Loading...`}>
          <ParksCount />
        </Suspense>
      </div>

      <div className="my-4 w-100">
        <Suspense fallback={`Loading...`}>
          <SuperAdminParkMonthlyFunds />
        </Suspense>
      </div>

      <SuperAdminPayouts />
    </Fragment>
  );
}

export default SuperAdminDashboard;
