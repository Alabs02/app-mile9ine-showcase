import { Fragment, useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import _, { isEmpty } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { TextField } from '../../FormField';
import { useRecoilState } from 'recoil';
import { userBeneficiariesAtom } from '../../../recoil/userBeneficiaries';
import './AddBeneficiary.css';
import 'animate.css';
import { catchAxiosErrors, transformToFormData, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';

const initialFormValues = () => {
  return {
    name: '',
    email: '',
    phone: ''
  }
}

const addBeneficiarySchema = object().shape({
  name: string()
    .max(70, 'Too Long!')
    .min(3, 'Too Short!')
    .required('Required!'),
  email: string()
    .email('Invalid Email Address!')
    .required('Required!'),
  phone: string()
    .max(11, 'Too Long!')
    .min(10, 'Too Short!')
    .required('Required!')
});

const AddBeneficiary = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [userBeneficiaries, setUserBeneficiaries] = useRecoilState(userBeneficiariesAtom);

  const updateState = (data) => {
    setUserBeneficiaries(beneficiaries => [...beneficiaries, data]);
  }


  return (
    <Fragment>
      <span data-toggle="modal" data-target="#addBeneficiaryModalside" className="add-menu-sidebar add__btn">
        <IoAddOutline size={'18px'} className="text-white mr-3" />
        <span>Add Beneficiary</span>
      </span>

      <div className="modal fade" id={`addBeneficiaryModalside`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="m-0 modal-title">Add Beneficiary</h5>
              <button type="button" className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>

            <div className="modal-body text-left">
              <Formik
                initialValues={initialFormValues()}
                validationSchema={addBeneficiarySchema}
                onSubmit={ async (values,  { resetForm }) => {
                  try {
                    setIsLoading(true);
                    const { data, status, statusText } = await postRequest(`/park_user/add-beneficary`, transformToFormData(values), {
                      headers: { authorization: `Bearer ${await getToken()}` }
                    });

                    if (data) {
                      console.log(data, status, statusText);
                      updateState(data?.beneficary);
                      toast.success(`Beneficiary Added Successfully!`);
                      resetForm();
                      setIsLoading(false);
                      document.getElementById("close_addBeneficiary_modal").click();
                    }
                  } catch (err) {
                    catchAxiosErrors(err, setIsLoading, null);
                  }
                }}
              >
                {props => (
                  <Form>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label htmlFor="name" className="text-label fs-6 m-0">Beneficiary's Name</label>
                        <Field type="text" name="name" as={TextField} placeholder="e.g John Snow" />
                        <ErrorMessage name="name">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-md-12 mb-3">
                        <label htmlFor="email" className="text-label fs-6 m-0">Beneficiary's Email</label>
                        <Field type="email" name="email" as={TextField} placeholder="e.g snow@example.com" />
                        <ErrorMessage name="email">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-md-12 mb-3">
                        <label htmlFor="phone" className="text-label fs-6 m-0">Beneficiary's Phone Number</label>
                        <Field type="tel" name="phone" as={TextField} placeholder="e.g 09012345678" />
                        <ErrorMessage name="phone">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                    </div>

                    <div className="mt-3 d-flex justify-content-end align-items-center">
                      <button ref={useRef()} type="button" id="close_addBeneficiary_modal" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
                      { isLoading
                        ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#ec3238" /> 
                        : <button type="submit" disabled={(isEmpty(props.errors) && props.isValid && _.size(props.values.name) > 0 && _.size(props.values.email) > 0 && _.size(props.values.phone) > 0) 
                            ? false : true} className="btn btn-primary animate__animated animate__pulse">Add Beneficiary</button>
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
  )
}

export default AddBeneficiary
