import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, number } from 'yup';
import { GiMoneyStack } from 'react-icons/gi';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { TextField } from '../../FormField';
import _, { isEmpty } from 'lodash';
import { catchAxiosErrors, transformToFormData } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';

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

const SuperAdminRequestPayout = () => {

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Fragment>
      <span className="add-menu-sidebar" data-toggle="modal" data-target="#request-payout-modal">
        <GiMoneyStack size={23} className="mr-2" />
        Request Payout
      </span>

      <div className="modal fade" tabIndex={-1} id="request-payout-modal">
        <div className="modal-dialog" role="dialog">
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
                    const { data, status, statusText } = await postRequest(``, transformToFormData(values), {
                      headers: { authorization: ``}
                    })
                  } catch (err) {
                    catchAxiosErrors(err, null, null);
                  }
                }}
              >
                {props => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-12">
                        <label htmlFor="amount" className="text-label fs-5 m-0">Amount</label>
                        <Field name="amount" type="number" as={TextField} placeholder="e.g 100" />
                        <ErrorMessage name="amount">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-end align-items-center">
                      <button id="close_request_pay_modal" type="button" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
                      { isLoading
                        ? <div className="d-flex align-items-center justify-content-center">Requesting...</div> 
                        : <button type="submit" disabled={(isEmpty(props.errors) && props.isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Request</button>
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

export default SuperAdminRequestPayout;
