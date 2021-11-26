import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { TextField, PasswordField } from '../../components/FormField';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import { toast } from 'react-toastify';
import { postRequest } from '../../utils/axiosClient';
import { transformToFormData, catchAxiosErrors } from '../../utils';
import localForage from '../../services/localforage';
import { Link } from 'react-router-dom';
import { parkAdminAtom } from '../../recoil/parkAdmin';
import { useRecoilState } from 'recoil';

const initialFormValues = () => {
  return {
    email: '',
    password: ''
  }
}

const parkAdminSigninSchema = object().shape({
  email: string()
    .email('Invalid Email Address')
    .required('Required'),
  password: string()
  .required('Required'),
});

const ParkAdminSignIn = () => {
  return (
    <Fragment>
    <h6 className="mb-2 text-center text-white">👋 Hello Park Admin</h6>
    <h4 className="mb-4 text-center text-white">Signin</h4>

    <Formik
      initialValues={initialFormValues()}
      validationSchema={parkAdminSigninSchema}
    >
    {props => (
      <Form>
        <div className="row">
          <div className="col-12 mb-3 col-md-12 col-lg-12">
            <label className="text-label text-white">Email</label>
            <Field name="email" as={TextField} placeholder="admin@example.com" />
            <ErrorMessage name="email">
              {msg => <div className="error-msg text-light">{msg}</div>}
            </ErrorMessage>
          </div>
          <div className="col-12 mb-3 col-md-12 col-lg-12">
            <label className="text-label text-white">Password</label>
            <Field name="password" as={PasswordField} placeholder="*******" />
            <ErrorMessage name="password">
              {msg => <div className="error-msg text-light">{msg}</div>}
            </ErrorMessage>
          </div>

          <div className="col-sm-12 d-flex justify-content-between my-2">
            <div className="form-group">
              <div className="custom-control custom-checkbox ml-1 text-white">
                <input type="checkbox" className="custom-control-input" id="basic_checkbox_1" />
                <label className="custom-control-label" htmlFor="basic_checkbox_1">Remember my preference</label>
              </div>
            </div>
            <div className="form-group">
              <Link className="text-white hover-underline" to="/park/admin/forgot-password">Forgot Password?</Link>
            </div>
          </div>
        </div>

        <CardAction values={props.values} isValid={props.isValid} errors={props.errors} resetForm={props.resetForm} />
      </Form>
    )}
    </Formik>

    {/*<div className="mt-5 card">
      <div className="pb-0 border-0 card-header">
        <h5 className="m-0 card-title text-muted fs-5">Admin Login Credentials</h5>
      </div>

      <div className="card-body">
        <div className="rounded basic-list-group bg-primary">
          <ul className="list-group">
            <li className="text-white list-group-item">Email: support@mile9ine.com</li>
            <li className="text-white list-group-item">Password: 1243Pass</li>
          </ul>
        </div>
      </div>
    </div>*/}
    </Fragment>
  );
}

const CardAction = ({ values, isValid, errors, resetForm }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false); 
  const [parkAdmin, setParkAdmin] = useRecoilState(parkAdminAtom);

  useEffect(() => {
    console.log(values, isValid, errors);
  }, [values]);

  const Signin = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park/login`, transformToFormData(values));

      if (data) {
        console.log(data, status, statusText);
        setParkAdmin(data?.park_admin);

        const forageData = {
          token: data?.token,
          isLoggedIn: true,
          type: 'park_admin'
        };

        localForage.setItem('credentials', forageData).then(() => localForage.getItem('credentials'))
        .then((val) => {
          console.log('Credentials', val)
          console.log('In localforage')
        }).catch((err) => console.error(err));

        toast.success(`Authentication successful, cheers 🥂`, {
          position: "top-center"
        });
        setIsLoading(false);
        setTimeout(() => {
          resetForm();
          window.location.reload(history.push('/park/admin/dashboard'));
        }, 4000);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading, null);
    }
  }

  return (
    <Fragment>
      <div className="mt-4 text-center">
        { isLoading
          ? <ThreeDots className="animate__animated animate__pulse" height="1em" width="4em" stroke="#ffffff" />
          : <button onClick={Signin} disabled={(isEmpty(errors) && isValid) ? false : true} type="button" className="bg-white btn text-primary btn-block animate__animated animate__pulse">Sign In</button>
        }
      </div>

      <div className="new-account mt-3">
        <p className="text-white">Is Your Park Not Signed? <Link className="text-white hover-underline" to="/register/park/">Sign up</Link></p>
      </div>
    </Fragment>
  );
}

CardAction.propTypes = {
  values: PropTypes.object,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  resetForm: PropTypes.any,
};

export default ParkAdminSignIn;
