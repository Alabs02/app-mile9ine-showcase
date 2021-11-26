import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import LoadScripts from '../../Hooks/loadScripts';
import { useRecoilValue, useRecoilState } from 'recoil';
import { withSuperAdmin } from '../../recoil/Super/superAdmin';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import _ from 'lodash';
import { TextField } from '../../components/FormField';
import { catchAxiosErrors, transformToFormData, getToken } from '../../utils';
import { postRequest } from '../../utils/axiosClient';
import { toast } from 'react-toastify';

const initailFormVals = (data) => {
  return {
    name: data?.name,
    email: data?.email,
    contact: data?.super_admin_detail?.contact,
  }
}

const updateSchema = object().shape({
  name: string()
    .required('Required!'),
  email: string()
    .email('Invaid Email Address')
    .required('Required!'),
  contact: string()
    .min(10, 'Too Short!')
    .max(14, 'Too Long!')
    .required('Required!'),
});

export const UpdateAdminProfileModal = () => {

  const [isLoading, setIsLoading] = useState(false); 
  const [superAdmin, setSuperAdmin] = useRecoilState(withSuperAdmin);
  const adminProfile = useRecoilValue(withSuperAdmin);
  console.log(adminProfile);
  
  return (
    <Fragment>
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" data-toggle="modal" data-target="#update-super-admin-profile">Update Profile</button>
      </div>

      <div tabIndex={0} className="modal fade" id="update-super-admin-profile">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Profile</h5>

              <AiOutlineCloseCircle size={20} className="btn-close pointer" data-dismiss="modal" />
            </div>
            <div className="modal-body">
              <Formik
                initialValues={initailFormVals(adminProfile)}
                validationSchema={updateSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    setIsLoading(true);
                    const { data, status, statusText } = await postRequest(`/super_admin/update-super_admin-profile`, transformToFormData(values), {
                      headers: { authorization: `Bearer ${await getToken()}` }
                    });

                    if (data) {
                      console.log(data, status, statusText);
                      setIsLoading(false);
                      setSuperAdmin(_.get(data, 'user', superAdmin));
                      toast.success(`Updated Successfully!`)
                      document.getElementById("close-update-superadmin-profile").click();
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
                      <div className="col-xl-12 mb-3">
                        <label htmlFor="name" className="text-label mb-1">Name</label>
                        <Field name="name" type="text" as={TextField} placeholder="John Snow" />
                        <ErrorMessage name="name">
                          {msg => <div className="error-msg text-danger fs-6">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-xl-12 mb-3">
                        <label htmlFor="email" className="text-label mb-1">Email</label>
                        <Field name="email" type="email" as={TextField} placeholder="email@email.com" />
                      </div>

                      <div className="col-xl-12 mb-3">
                        <label htmlFor="contact" className="text-label mb-1">Contact</label>
                        <Field name="contact" type="tel" as={TextField} placeholder="09012345678" />
                      </div>

                      <div className="mt-4 d-flex w-100 justify-content-end">
                        <button id="close-update-superadmin-profile" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
                        { isLoading
                          ? `Updating...`
                          : <button type="submit" className="btn btn-primary">Update</button>
                        }
                      </div>
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

const SuperAdminProfile = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  const adminProfile = useRecoilValue(withSuperAdmin);
  console.log(adminProfile);

  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 col-sm-12 mb-2">
                  <h5>Name:</h5>
                  <p>{_.get(adminProfile, 'name', null)}</p>
                </div>

                <div className="col-md-4 col-sm-12 mb-2">
                  <h5>Email Address:</h5>
                  <p>{_.get(adminProfile, 'email', null)}</p>
                </div>

                <div className="col-md-4 col-sm-12 mb-2">
                  <h5>Phone Number:</h5>
                  <p>{
                    (_.get(adminProfile, 'super_admin_detail.contact', null) === null)
                    ? 'No Phone NUmber'
                    : _.get(adminProfile, 'super_admin_detail.contact', null)
                  }</p>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  {/* Modal*/}
                  <UpdateAdminProfileModal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default SuperAdminProfile; 
