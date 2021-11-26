import { Fragment, useState } from 'react';
import { Formik, Form,  Field, ErrorMessage } from 'formik';
import { object, number } from 'yup'; 
import { GiMoneyStack } from 'react-icons/gi';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { catchAxiosErrors, transformToFormData, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import { TextField } from '../../FormField';
import { useRecoilState } from 'recoil';
import { parkAdminAtom } from '../../../recoil/parkAdmin';
import './ParkAdminRequestPayout.css';


const initialFormValues = () => {
  return {
    amount: 0,
  }
}

const schema = object().shape({
  amount: number()
    .min(100, 'You can only withdraw a minimum of 100!')
    .required('Required!'),
});

const ParkAdminRequestPayout = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [parkAdminProfile, setParkAdminProfile] = useRecoilState(parkAdminAtom);
  console.log(parkAdminProfile);

  return (
    <Fragment>
      <span data-toggle="modal" data-target="#modalAdminRequest" className="add-menu-sidebar add__btn">
        <GiMoneyStack size={23} className=" text-white mr-2" />
        <span>Request Payout</span>
      </span>

      <div className="modal fade" id="modalAdminRequest">
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
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    setIsLoading(true);
                    const { data, status } = await postRequest(`/park_admin/request-cash-transfer-weekly`, transformToFormData(values), {
                      headers: { authorization: `Bearer ${await getToken()}` }
                    });

                    if (data) {
                      console.log(data);
                      setParkAdminProfile(data.park_admin);
                      setIsLoading(false);
                      toast.success(`Payout Successfully!`);
                      resetForm();
                      document.getElementById("close_park_admin_payout").click();
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
                        <Field name="amount" as={TextField} placeholder="e.g 100" />
                        <ErrorMessage name="amount">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="mt-4 d-flex justify-content-end w-100">
                      <button type="button" id="close_park_admin_payout" className="btn btn-danger light" data-dismiss="modal">Close</button>
                      { isLoading
                        ? <div className="text-muted d-flex justify-content-centers">Requesting...</div>
                        : <button type="submit" className="btn btn-primary">Request</button>
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

export default ParkAdminRequestPayout;
