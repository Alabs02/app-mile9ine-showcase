import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, number } from 'yup';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import _, { isEmpty } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { catchAxiosErrors, transformToFormData, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { TextField } from '../../FormField';
import { toast } from 'react-toastify';
import { GiTakeMyMoney } from 'react-icons/gi';
import { useRecoilState } from 'recoil';
import { parkUserAtom } from '../../../recoil/parkUser';
import './UserRequestPayout.css';
import 'animate.css';

const initialFormVal = () => {
  return {
    amount: 0,
  }
}

const schema = object().shape({
  amount: number()
    .min(100, 'Too Small!')
    .required("Required!"),
});

const UserRequestPayout = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [parkUser, setparkUser] = useRecoilState(parkUserAtom);

  return (
    <Fragment>
      <span data-toggle="modal" data-target="#addRequestPayoutModalside" className="add-menu-sidebar add__btn">
        <GiTakeMyMoney size={'18px'} className="text-white mr-3" />
        <span>Request Payout</span>
      </span>

      <div className="modal fade" id="addRequestPayoutModalside">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="m-0 modal-title">Request payout</h5>
              <button type="button" className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={initialFormVal()}
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    setIsLoading(true);
                    const { data, status } = await postRequest(`/park_user/request-cash-transfer-weekly`, transformToFormData(values), {
                      headers: { authorization: `Bearer ${await getToken()}` }
                    });

                    if (data) {
                      console.log(data);
                      setparkUser(data.data);
                      setIsLoading(false);
                      toast.success(`Payout Successfull!`);
                      document.getElementById("close_user_request_modal").click();
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
                        <label htmlFor="amount" className="text-label fs-6 m-0">Amount</label>
                        <Field name="amount" text="number" as={TextField} placeholder="e.g 100" />
                        <ErrorMessage name="amount">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-end align-items-center">
                      <button type="button" id="close_user_request_modal" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
                      { isLoading
                        ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" />
                        : <button type="submit" disabled={(props.isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Request</button>
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

export default UserRequestPayout;
