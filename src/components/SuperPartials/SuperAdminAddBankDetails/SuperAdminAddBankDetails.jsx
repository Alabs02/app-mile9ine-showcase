import { Fragment, useState } from 'react';
import { Formik, Form, Field, FastField, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IoAddOutline } from 'react-icons/io5'
import { catchAxiosErrors, transformToFormData, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import { useRecoilValue, useRecoilState } from 'recoil';
import { withGetAllBanksQuery } from '../../../recoil/getAllBanks';
import { withSuperAdminBankDetailsQuery, superAdminBankDetailsAtom } from '../../../recoil/Super/superAdminBankDetails';
import _, { isEmpty } from 'lodash';
import { TextField } from '../../FormField';
import './SuperAdminAddBankDetails.css';
import 'animate.css';

const initialFormValues = () => {
  return {
    account_number: '',
    account_bank: '',
  }
}

const addBankSchema = object().shape({
  account_number: string()
    .required('Required!'),
  account_bank: string()
    .required('Required!'),
});

const SuperAdminAddBankDetails = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useRecoilState(superAdminBankDetailsAtom);
  const banksArray = useRecoilValue(withGetAllBanksQuery);
  const bankDetailsArr = useRecoilValue(withSuperAdminBankDetailsQuery);
  console.log('Bank Details:', bankDetailsArr.length);

  return (
    <Fragment>
      {(bankDetailsArr.length === 0)
        ? <span className="add-menu-sidebar add__btn" data-toggle="modal" data-target="#basicModalBankDetails">
            <IoAddOutline size={'18px'} className="text-white mr-3" />
            <span>Add Bank Details</span>
          </span>
        : ``
      }
      

      <div className="modal fade" id="basicModalBankDetails" tabIndex={-1}>
        <div className="modal-dialog" role="dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Add Bank Details</div>
              <button type="button" className="close" data-dismiss="modal">
                <AiOutlineCloseCircle />
              </button>
            </div>

            <div className="modal-body">
              <Formik
                initialValues={initialFormValues()}
                validationSchema={addBankSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    setIsLoading(true);
                    const { data, status, statusText } = await postRequest(`/super_admin/add-bank-details`, transformToFormData(values), {
                      headers: { authorization: `Bearer ${await getToken()}` }
                    });

                    if (data) {
                      console.log(data);
                      setBankDetails([...banksArray, data?.bank_details[0]]);
                      setIsLoading(false);
                      toast.success(`Added Successfully!`);
                      document.getElementById("close_addbank_details_modal").click();
                    }
                  } catch (err) {
                    catchAxiosErrors(err, setIsLoading, null);
                  }
                }}
              >
                {props => (
                  <Form>
                    <div className="row text-left">
                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="account_bank" className="text-label fs-6 m-0">Your Bank</label>
                        <FastField name="account_bank">
                          {({ field }) => (
                            <select className="default-select form-control" {...field}>
                              <option defaultValue="">Select Bank</option>
                              {isEmpty(banksArray)
                                ? <option value="">No Banks</option>
                                : banksArray.map((bank) => (
                                    <option key={_.get(bank, 'id', null)} value={_.get(bank, 'code', null)}>{_.get(bank, 'name', null)}</option>
                                  ))
                              }
                            </select>
                          )}
                        </FastField>
                        <ErrorMessage name="account_bank">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-12 mb-3">
                        <label htmlFor="account_number" className="text-label fs-6 m-0">Account Numbers</label>
                        <Field type="text" name="account_number" as={TextField} placeholder="e.g 1234567890" />
                        <ErrorMessage name="account_number">
                          {msg => <div className="error-msg text-warning">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-end align-items-center">
                      <button id="close_addbank_details_modal" type="button" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
                      { isLoading
                        ? <div className="text-muted">Adding...</div> 
                        : <button type="submit" disabled={(_.isEmpty(props.errors) && props.isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Add</button>
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

export default SuperAdminAddBankDetails;
