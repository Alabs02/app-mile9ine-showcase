import { Fragment, useState } from 'react';
import { Formik, Form, Field, FastField, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import _, { isEmpty } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { catchAxiosErrors, transformToFormData, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import { TextField } from '../../FormField';
import { useRecoilValue, useRecoilState } from 'recoil';
import { withGetAllBanksQuery } from '../../../recoil/getAllBanks';
import { userBankDetailsAtom, withUserBankDetailsQuery } from '../../../recoil/userBankDetails';
import './AddUserBankDetails.css';

const initailFormVal = () => {
  return {
    account_number: '',
    account_bank: '',
  }
}

const schema = object().shape({
  account_number: string()
    .required('Required!'),
  account_bank: string()
    .required('Required!'),
});

const AddUserBankDetails = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useRecoilState(userBankDetailsAtom);
  const banks = useRecoilValue(withGetAllBanksQuery);
  const bankDetailsArr = useRecoilValue(withUserBankDetailsQuery);
  console.log('All Banks:', banks);

  return (
    <Fragment>
      { (bankDetailsArr.length === 0)
        ? <span data-toggle="modal" data-target="#addBankDetailsModalside" className="add-menu-sidebar add__btn">
            <IoAddOutline size={'18px'} className="text-white mr-3" />
            <span>Add Bank Details</span>
          </span>
        : ``
      }

      <div className="modal fade" id="addBankDetailsModalside">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="m-0 modal-title">Add Bank Details</h5>
              <button type="button" className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>

            <div className="modal-body">
              <Formik
                initialValues={initailFormVal()}
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    setIsLoading(true);
                    const { data, status } = await postRequest(`/park_user/add-bank-details`, transformToFormData(values), {
                      headers: { authorization: `Bearer ${await getToken()}` }
                    })

                    if (data) {
                      console.log(data)
                      setBankDetails({});
                      setIsLoading(false);
                      toast.success(`Added Successfully!`);
                      document.getElementById("close_adduserbank_details_modal").click();
                    }
                  } catch (err) {
                    catchAxiosErrors(err, setIsLoading, null);
                  }
                }}
              >
                  {props => (
                    <Form>
                      <div className="row text-left">
                        <div className="col-sm-12 mb-3">
                          <label htmlFor="account_bank" className="text-label fs-6 m-0">Select Bank</label>
                          <FastField name="account_bank">
                            {({ field }) => (
                              <select className="form-control" {...field}>
                                <option defaultValue="">Select</option>
                                {isEmpty(banks)
                                  ? <option value="">No Banks</option>
                                  : banks.map((bank) => (
                                      <option key={_.get(bank, 'id', null)} value={_.get(bank, 'code', null)}>{_.get(bank, 'name', null)}</option>
                                    ))
                                }
                              </select>
                            )}
                          </FastField>
                          <ErrorMessage name="account_number">
                            {msg => <div className="error-msg text-danger">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 mb-3">
                          <label htmlFor="account_number" className="text-label fs-6 m-0">Account Number</label>
                          <Field name="account_number" type="text" as={TextField} placeholder="e.g 1234567890" />
                          <ErrorMessage name="account_number">
                            {msg => <div className="error-msg text-danger">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>  

                      <div className="mt-3 d-flex justify-content-end align-items-center">
                        <button type="button" id="close_adduserbank_details_modal" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
                        { isLoading
                          ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
                          : <button type="submit" disabled={(props.isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Add</button>
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

export default AddUserBankDetails;
