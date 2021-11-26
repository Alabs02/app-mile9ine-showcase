import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { catchAxiosErrors, transformToFormData } from '../../utils';
import { postRequest } from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { TextField, PasswordField} from '../../components/FormField';
import 'animate.css';

const initialFormVal = (email) => {
  return {
    email: email,
    otp: '',
    password: '',
  }
}

const updatePasswordSchema = object().shape({
  email: string()
    .email('Invalid Email Address!')
    .required('Required!'),
  otp: string()
    .required('Required!'),
  password: string()
    .required('Required!'),
});


const UserForgotPassword = () => {

  const history = useHistory();
  const [isLoding, setIsLoading] = useState(false);
  const [nextStep, setNextStep] = useState(1);
  const [email, setEmail] = useState('');

  const forgotPassword = async () => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/forgot-password`, transformToFormData({ email }));

      if (data) {
        console.log(data, status, statusText);
        setIsLoading(false);
        toast.success(`Successful, check your email for OTP token!`);
        setTimeout(() => {
          setNextStep(nextStep+1);
        }, 4000);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading, null);
    }
  }

  return (
    <Fragment>
      { (nextStep > 1)
        ? <div className="row animate__animated animate__fadeIn">
            <div className="col-xl-12 text-center">
              <h4 className="mb-4 text-center text-white">Reset Password</h4>
            </div>

            <div className="col-xl-12 mb-3">
              <Formik
                initialValues={initialFormVal(email)}
                validationSchema={updatePasswordSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    setIsLoading(true);
                    const { data, status, statusText } = await postRequest(`/update-password`, transformToFormData(values));

                    if (data) {
                      console.log(data);
                      setIsLoading(false);
                      toast.success(`Updated Successfully!`);
                      resetForm();
                      setTimeout(() => {
                        history.push(`/park/user/signin`);
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
                      <div className="col-xl-12 mb-3">
                        <label htmlFor="email" className="text-label text-white fs-5 mb-1">Email</label>
                        <Field name="email" type="email" as={TextField} placeholder="e.g mail@example.com" />
                        <ErrorMessage name="email">
                          {msg => <div className="error-msg error-msg--light text-white">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-xl-12 mb-3">
                        <label htmlFor="otp" className="text-label text-white fs-5 mb-1">OTP Code</label>
                        <Field name="otp" type="text" as={TextField} placeholder="e.g 213630" />
                        <ErrorMessage name="otp">
                          {msg => <div className="error-msg error-msg--light text-white">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-xl-12 mb-3">
                        <label htmlFor="password" className="text-label text-white fs-5 mb-1">Password</label>
                        <Field name="password" as={PasswordField} placeholder="e.g ******" />
                        <ErrorMessage name="password">
                          {msg => <div className="error-msg error-msg--light text-white">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="text-center">
                      { isLoding
                        ? <div className="d-flex w-100 justify-content-center text-white">Reseting...</div>
                        : <button disabled={(props.isValid) ? false : true} type="submit" className="bg-white btn text-primary btn-block">Reset</button>
                      }
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        : <div className="row animate__animated animate__fadeIn">
            <div className="col-xl-12 text-center">
              <h4 className="mb-4 text-center text-white">Forgot Password</h4>
            </div>

            <div className="col-xl-12 mb-3">
              <label htmlFor="email_one" className="text-label m-0 fs-5 text-white">Email</label>
              <input type="email" onChange={e => setEmail(e.target.value)} className="form-control" placeholder="e.g mail@example.com" />
            </div>

            <div className="text-center col-xl-12">
              { isLoding
                ? <div className="d-flex w-100 justify-content-center text-white">Loading...</div>
                : <button onClick={forgotPassword} disabled={(email.length > 1) ? false : true} type="button" className="bg-white btn text-primary btn-block">Forgot Password</button>
              }
            </div>
                        
          </div>
      }
    </Fragment>
  );
}

export default UserForgotPassword;
