import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { PasswordField, TextField } from '../../components/FormField';
import { ThreeDots } from 'react-loading-icons';
import { catchAxiosErrors, transformToFormData, slugify } from '../../utils';
import { postRequest } from '../../utils/axiosClient';
import _, { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import localForage from '../../services';
import { toast } from 'react-toastify';
import { parkUserAtom } from '../../recoil/parkUser';
import { getUserTypeAtom } from '../../recoil/getUserType';
import { useRecoilState } from 'recoil';
import './UserSignIn.css';
import 'animate.css';

const initialFormValues = () => {
  return {
    email: '',
    password: '',
  }
}

const signinSchema = object().shape({
  email: string()
    .email('Invalid Email Address!')
    .required('Required!'),
  password: string()
    .required('Required!'),
});

const UserSignIn = () => {

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [parkUser, setParkUser] = useRecoilState(parkUserAtom);
  const [userType, setUserType] = useRecoilState(getUserTypeAtom);

  return (
    <Fragment>
      <h6 className="mb-2 text-center text-white">👋 Welcome back!</h6>
      <h4 className="mb-4 text-center text-white">Sign into your account</h4>

      <Formik
        initialValues={initialFormValues()}
        validationSchema={signinSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            setIsLoading(true);
            const { data, status, statusText } = await postRequest(`/park/user/login`, transformToFormData(values));

            if (data) {
              console.log(data, status, statusText);
              console.log('Signin state:', parkUser);
              setParkUser(data?.user);

              const forageData = {
                token: data?.token,
                isLoggedIn: true,
                type: 'park_user'
              }

              localForage.setItem('credentials', forageData).then(() => localForage.getItem('credentials'))
              .then((val) => {
                console.log('Credentials', val)
                console.log('In localforage')
              }).catch((err) => console.error(err));

              toast.success(`Logged in successfully!`)
              setUserType("park_user");
              console.log('Type:', userType);
              setIsLoading(false);
              setTimeout(() => {
                resetForm();
                window.location.reload(history.push(`/park/${slugify(_.get(data, 'user.name', null))}/dashboard`));
              }, 4000)

            }
          } catch (err) {
            catchAxiosErrors(err, setIsLoading, null);
          }
        }}
      >
        {props => (
          <Form>
            <div className="row text-left">

              <div className="col-md-12 col-sm-12 mb-3">
                <label className="text-label text-white">Email</label>
                <Field type="email" name="email" as={TextField} placeholder="e.g snow@example.com" />
                <ErrorMessage name="email">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="col-md-12 col-sm-12 mb-3">
                <label className="text-label text-white">Password</label>
                <Field name="password" as={PasswordField} placeholder="******" />
                <ErrorMessage name="password">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>

            </div>

            <div className="form-row d-flex justify-content-between mt-2 mb-2">
              <div className="form-group">
                <div className="custom-control custom-checkbox ml-1 text-white">
                  <input type="checkbox" className="custom-control-input" id="basic_checkbox_1" />
                  <label className="custom-control-label" htmlFor="basic_checkbox_1">Remember my preference</label>
                </div>
              </div>
              <div className="form-group">
                <Link className="text-white hover-underline" to="/park/user/forgot-password">Forgot Password?</Link>
              </div>
            </div>

            <div className="mt-2 text-center">
              {isLoading
                ? <ThreeDots  className="animate__animated animate__pulse" height="1em" width="4em" stroke="#ffffff" />
                : <button disabled={(isEmpty(props.errors) && props.isValid) 
                  ? false : true} type="submit" className="bg-white btn text-primary btn-block animate__animated animate__pulse">Sign Me In</button>
              }
            </div>

            <div className="new-account mt-3">
              <p className="text-white">Don't have an account? <Link className="text-white hover-underline" to="/park/user/signup">Sign up</Link></p>
            </div>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
}

export default UserSignIn;
