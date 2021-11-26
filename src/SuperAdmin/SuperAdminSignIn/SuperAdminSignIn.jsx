import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { catchAxiosErrors, transformToFormData, slugify} from '../../utils';
import { TextField, PasswordField } from '../../components/FormField';
import _, { isEmpty } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { Link } from 'react-router-dom';
import { postRequest } from '../../utils/axiosClient';
import localForage from '../../services';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { useRecoilState } from 'recoil';
import { superAdminAtom } from '../../recoil/Super/superAdmin';
import 'animate.css';

const initialFormValues = () => {
  return {
    email: '',
    password: '',
  }
}

const adminSchema = object().shape({
  email: string()
    .email('Invalid Email Address')
    .required('Required!'),
  password: string()
    .required('Required!')
});

const SuperAdminSignIn = () => {

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [superAdmin, setSuperAdmin] = useRecoilState(superAdminAtom);

  return (
    <Fragment>
      <h6 className="mb-2 text-center text-white">👋 Hello Super Admin</h6>
      <h4 className="mb-4 text-center text-white">Sign in your account</h4>

      <Formik
        initialValues={initialFormValues()}
        validationSchema={adminSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            setIsLoading(true);
            const { data, status, statusText } = await postRequest(`/super_admin/login`, transformToFormData(values));

            if (data) {
              console.log(data, status, statusText);
              setSuperAdmin(data?.user);

              const forageData = {
                token: data?.token,
                isLoggedIn: true,
                type: 'super_admin'
              }

              localForage.setItem('credentials', forageData).then(() => localForage.getItem('credentials'))
                .then((val) => {
                  console.log('Credentials', val)
                  console.log('In localforage')
                }).catch((err) => console.error(err));

              toast.success(`Logged in successfully!`);
              setIsLoading(false);

              setTimeout(() => {
                resetForm();
                // window.location.reload(history.push(`/super/admin/${data?.user?.name}/profile`));
                window.location.reload(history.push(`/super/admin/dashboard`));
              }, 4000);
            }
          } catch (err) {
            catchAxiosErrors(err, setIsLoading, null);
          }
        }}
      >
        {props => (
          <Form>
            <div className="row text-left">
              <div className="form-group col-sm-12 mb-3">
                <label className="mb-1 text-white text-label">Email</label>
                <Field name="email" type="email" as={TextField} placeholder="e.g example@webite.com" />
                <ErrorMessage name="email">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="form-group col-sm-12 mb-3">
                <label className="text-label text-white">Password</label>
                <Field name="password" as={PasswordField} placeholder="*******" />
                <ErrorMessage name="password">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="form-row d-flex justify-content-between col-xl-12">
                <div className="form-group">
                  <div className="custom-control custom-checkbox ml-1 text-white">
                    <input type="checkbox" className="custom-control-input" id="basic_checkbox_1" />
                    <label className="custom-control-label" htmlFor="basic_checkbox_1">Remember my preference</label>
                  </div>
                </div>
                <div className="form-group">
                  <Link className="text-white hover-underline" to="/super/admin/forgot-password">Forgot Password?</Link>
                </div>
              </div>

              <div className="mt-4 text-center col-lg-12">
                {isLoading
                  ? <ThreeDots  className="animate__animated animate__pulse" height="1em" width="4em" stroke="#ffffff" />
                  : <button type="submit" className="bg-white btn text-primary btn-block animate__animated animate__pulse">Sign Me In</button>
                }
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
}

export default SuperAdminSignIn;
