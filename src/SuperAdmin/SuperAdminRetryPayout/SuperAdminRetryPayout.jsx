import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import LoadScripts from '../../Hooks/loadScripts';
import { TextField } from '../../components/FormField';
import { catchAxiosErrors, transformToFormData, getToken } from '../../utils';
import { postRequest } from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { superAdminGetPayoutsAtom } from '../../recoil/Super/superAdminGetPayouts';
import './SuperAdminRetryPayout.css';

const initialFormValues = () => {
  return {
    payout_id: '',
  }
}

const retrySchema = object().shape({
  payout_id: string()
    .required('Required!'),
});

const SuperAdminRetryPayout = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  const [isLoading, setIsLoading] = useState(false);
  const [payouts, setPayout] = useRecoilState(superAdminGetPayoutsAtom);

  return (
    <Fragment>
      <div className="d-app-flex mb-3">
        <h4 className="text-uppercase fs-5 overline m-0">Retry Payout</h4>
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={initialFormValues()}
                validationSchema={retrySchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    setIsLoading(false);
                    console.log(values);
                    const { data, status, statusText } = await postRequest(`/super_admin/retry-transfer`, transformToFormData(values), {
                      headers: { authorization: `Bearer ${await getToken()}` }
                    });

                    if (data) {
                      console.log(data);
                      setPayout({});
                      setIsLoading(false);
                      toast.success(`Successful cheers!`);
                      resetForm();
                    }
                  } catch (err) {
                    catchAxiosErrors(err, setIsLoading, null);
                  }
                }}
              >
                {props => (
                  <Form>
                    <div className="col-xl-12">
                      <label htmlFor="payout_id" className="text-label fs-5">Payout ID</label>
                      <Field name="payout_id" as={TextField} placeholder="e.g 15120741" />
                      <ErrorMessage name="payout_id">
                        {msg => <div className="error-msg text-danger">{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      {isLoading
                        ? <div className="d-flex w-100 justify-content-center">Retrying...</div>
                        : <button type="submit" className="btn btn-primary px-4">Retry</button>
                      }
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default SuperAdminRetryPayout;
