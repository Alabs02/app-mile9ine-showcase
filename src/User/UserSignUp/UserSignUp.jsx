import { Fragment, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import _, { isEmpty } from 'lodash';
import { PasswordField, TextField } from '../../components/FormField';
import { catchAxiosErrors, transformToFormData, slugify } from '../../utils';
import { ThreeDots } from 'react-loading-icons';
import { postRequest } from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getUserTypeAtom } from '../../recoil/getUserType';
import PolicyModal from '../../components/core/PolicyModal';
import './UserSignUp.css';

const initialFormValues = () => {
  return {
    name: '',
    email: '',
    password: '',
    address: '',
  }
}

const signupSchema = object().shape({
  name: string()
    .min(3,'Too Short!')
    .max(70, 'Too Long!')
    .required('Required!'),
  email: string()
    .email('Invalid Email Address!')
    .required('Required!'),
  password: string()
    .min(6,'Password must be atleast six (6) characters!')
    .required('Required!'),
  address: string()
    .min(3,'Too Short!')
    .max(150, 'Too Long!')
    .required('Required!'),
});

const UserSignUp = () => {

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useRecoilState(getUserTypeAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    // alert(policy);
  }, [policy]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const onClose = () => {
    setIsModalOpen(false);
    return true;
  }

  return (
    <Fragment>
      <h6 className="mb-2 text-center text-white">👋 Hello Esteem User</h6>
      <h4 className="mb-4 text-center text-white">Sign Up on Mile9ine</h4>

      <Formik
        initialValues={initialFormValues()}
        validationSchema={signupSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (policy === "on") {
              setIsLoading(true);

              const { data, status, statusText } = await postRequest(`/park/user/register`, transformToFormData(values));
              
              if (data) {
                console.log(data, status, statusText);
                setIsLoading(false);
                setPolicy(null);
                toast.success('Registration successful, and warmest welcome to Mile9ine cheers!');
                setUserType("park_user");
                if (_.get(data, 'user.type', null) === 'user') {
                  console.log('Type:', userType);
                  setTimeout(() => {
                    resetForm();
                    window.location.reload(history.push(`/park/${slugify(_.get(data, 'user.name', null))}/dashboard`));
                  }, 1000);
                }
              }
            } else {
              toast.warning(`You have to agree to the Privacy Policy to proceed!`);
            }
          } catch (err) {
            setPolicy(null);
            catchAxiosErrors(err, setIsLoading, null);
          }
        }}
      >
        {props => (
          <Form>
            <div className="row text-left">
              <div className="col-md-12 col-sm-12 mb-3">
                <label className="text-label text-white">Your Name</label>
                <Field type="text" name="name" as={TextField} placeholder="e.g John Snow" />
                <ErrorMessage name="name">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="col-md-12 col-sm-12 mb-3">
                <label className="text-label text-white">Your Email</label>
                <Field type="text" name="email" as={TextField} placeholder="e.g snow@example.com" />
                <ErrorMessage name="email">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="col-md-12 col-sm-12 mb-3">
                <label className="text-label text-white">Your Password</label>
                <Field name="password" as={PasswordField} placeholder="******" />
                <ErrorMessage name="password">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>

              <div className="col-md-12 col-sm-12 mb-3">
                <label className="text-label text-white">Your Address</label>
                <Field type="text" name="address" as={TextField} placeholder="e.g NY Main St.s" />
                <ErrorMessage name="address">
                  {msg => <div className="error-msg text-light">{msg}</div>}
                </ErrorMessage>
              </div>
            </div>

            <div className="form-row d-flex justify-content-between mt-2 mb-2">
              <div className="form-group">
                <div className="custom-control custom-checkbox ml-1 text-white">
                  <input onChange={e => setPolicy(e.target.value)} type="checkbox" className="custom-control-input" id="basic_checkbox_1"  checked={policy === "on" ? true : false} />
                  <label className="custom-control-label" htmlFor="basic_checkbox_1">I agree to all <span className="terms" onClick={toggleModal}>Privacy Policy</span></label>
                </div>
              </div>
            </div>

            <div className="mt-2 text-center">
              {isLoading
                ? <ThreeDots  className="animate__animated animate__pulse" height="1em" width="4em" stroke="#ffffff" />
                : <button disabled={(isEmpty(props.errors) && props.isValid && _.size(_.get(props.values, 'name', null)) > 0 && _.size(_.get(props.values, 'address', null))) 
                  ? false : true} type="submit" className="bg-white btn text-primary btn-block animate__animated animate__pulse">Start Booking Rides</button>
              }
            </div>

            <div className="new-account mt-3">
              <p className="text-white">Already have an account? <Link className="text-white hover-underline" to="/park/user/signin">Sign in</Link></p>
            </div>
          </Form>
        )}
      </Formik>

      <PolicyModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        onClose={onClose}
        title={"Privacy Policy"}
      >
        <h4 className="text-center text-gray">Personal Data may be collected for the following purposes</h4>
        <section className="">
          <h4 className="text-gray font-w700 mt-4">Communicating with user</h4>

          <h6 className="mt-2 font-w600 text-gray">Contact form</h6>
          <p className="text-gray">
            Personal Data: address; state; country; date of birth; email address; first name; gender; last name; phone number; user/referral ID.
          </p>

          <h6 className="mt-2 font-w600 text-gray">Phone contact</h6>
          <p className="text-gray">
            Personal Data: phone number.
          </p>
          
          <h6 className="mt-2 font-w600 text-gray">Mailing list or newsletter</h6>
          <p className="text-gray">
            Personal Data: address; state; country; cookies; date of birth; email address; first name; gender; last name; phone number.
          </p>
        </section>

        <section className="">
          <h4 className="text-gray font-w700 mt-4">Content performance</h4>

          <h6 className="mt-2 font-w600 text-gray">Google Optimize</h6>
          <p className="text-gray">
            Personal Data: cookies; usage data
          </p>
        </section>

        <section className="">
          <h4 className="text-gray font-w700 mt-4">Hosting and backend infrastructure</h4>

          <h6 className="mt-2 font-w600 text-gray">DigitalOcean and Laravel</h6>
          <p className="text-gray">
            Personal Data: various types of data as specified in the privacy policy of the service.
          </p>
        </section>

        <section className="">
          <h4 className="text-gray font-w700 mt-4">Interaction with social media platforms </h4>

          <h6 className="mt-2 font-w600 text-gray">Twitter, Facebook, Instagram, WhatsApp, YouTube buttons and widgets</h6>
          <p className="text-gray">
          Personal Data: cookies; usage data.
          </p>
        </section>

        <section className="">
          <h4 className="text-gray font-w700 mt-4">Hosting and backend infrastructure</h4>

          <h6 className="mt-2 font-w600 text-gray">DigitalOcean and Laravel</h6>
          <p className="text-gray">
            Personal Data: various types of data as specified in the privacy policy of the service.
          </p>
        </section>

        <section className="">
          <h6 className="mt-4 font-w600 text-gray">Legal action</h6>
          <p className="text-gray">
            The User's Personal Data may be provided upon request by public authorities, used for legal purposes by Mile9ine in Court or in the stages leading to possible legal action in situations arising from improper use of this website or the related services.
          </p>

          <h6 className="mt-4 font-w600 text-gray">Additional information about User's Personal Data</h6>
          <p className="text-gray">
            In addition to the information contained in this privacy policy, this website may provide the User with additional and contextual information concerning particular services or the collection and processing of Personal Data upon request.
          </p>

          <h6 className="mt-4 font-w600 text-gray">Operation and maintenance</h6>
          <p className="text-gray">
            For operation and maintenance purposes, this website and any third-party services may collect files that record interaction with this website and use other Personal Data (such as the IP Address) for this purpose.
          </p>

          <h6 className="mt-4 font-w600 text-gray">Information not contained in this policy</h6>
          <p className="text-gray">
            More details concerning the collection or processing of Personal Data may be requested from the Mile9ine at any point in time.
          </p>

          <h6 className="mt-4 font-w600 text-gray">Changes to this privacy policy</h6>
          <p className="text-gray">
            Mile9ine reserves the right to make changes to this privacy policy at any time by notifying its Users on this page and possibly within this website and/or - as far as technically and legally feasible - sending a notice to Users via email. It is strongly recommended to check this page often, referring to the date of the last modification listed at the bottom. User also agrees that consent has been given when this change has been made
          </p>

          <p className="text-gray mt-3">
            Should the changes affect processing activities performed on the basis of the User’s consent, Mile9ine  shall collect new consent from the User, where required.
          </p>
        </section>

        <section className="">
          <h4 className="text-gray font-w700 mt-4">Users’ Rights</h4>

          <p className="text-gray">Users may exercise certain rights regarding their Data processed by Mile9ine.</p>

          <p className="text-gray fs-5">In particular, Users have the right to do the following:</p>

          <ul className="mt-2">
              <li className="">
                <h6 className="font-w600">Withdraw their consent at any time. </h6>
                <p>Users have the right to withdraw consent where they have previously given their consent to the processing of their Personal Data by sending a mail to <span className="text-blue text-underline">info@mile9ine.com</span></p>
              </li>
              <li className="">
                <h6 className="font-w600">Object to processing of their Data. </h6>
                <p>Users have the right to object to the processing of their Data if the processing is carried out illegally.</p>
              </li>
              <li className="">
                <h6 className="font-w600">Verify and seek rectification. </h6>
                <p>Users have the right to verify the accuracy of their Data and ask for it to be updated or corrected.</p>
              </li>
              <li className="">
                <h6 className="font-w600">Restrict the processing of their Data. </h6>
                <p>Users have the right, under certain circumstances, to restrict the processing of their Data. In this case, Mile9ine will not process their Data for any purpose other than storing it.</p>
              </li>

              <li className="">
                <h6 className="font-w600">Lodge a complaint. </h6>
                <p>Users have the right to bring a claim before their competent data protection authority.</p>
              </li>

              <li className="">
                <h6 className="font-w600">Verify and seek rectification. </h6>
                <p>Users have the right to verify the accuracy of their Data and ask for it to be updated or corrected.</p>
              </li>
          </ul>
        </section>

        <section className="">
          <h6 className="mt-2 font-w600 text-gray">Details about the right to object to processing</h6>
          <p className="text-gray">
            Where Personal Data is processed for a public interest, in the exercise of a vested official authority vested in Mile9ine for the purposes of the legitimate or legal interests pursued by the Mile9ine, Users may object to such processing by providing a ground related to their particular situation to justify the objection.
          </p>

          <p className="text-gray mt-3">
            Users must know that, however, should their Personal Data be processed for direct marketing purposes, they can object to that processing at any time without providing any justification by unsubscribing.
          </p>
        </section>

        {/*<section className="">
          <h6 className="mt-2 font-w700 text-gray">By pressing this "Proceed to payment” button, you accept the privacy policy as well as undertake to independently find out travel requirements of transit bus/car.</h6>
          <h6 className="mt-2 font-w700 text-gray">When a user searches for a ride and it’s not on the platform, there should be a display;</h6>
          <h6 className="mt-4 mb-4 font-w700 text-dark">This ride/route is not available on the Mile9ine platform. Kindly refer this bus/car terminal and earn some income side.</h6>
          <p className="text-gray">
            Where Personal Data is processed for a public interest, in the exercise of a vested official authority vested in Mile9ine for the purposes of the legitimate or legal interests pursued by the Mile9ine, Users may object to such processing by providing a ground related to their particular situation to justify the objection.
          </p>

          <p className="text-gray mt-3">
            Mile9ine refer and earn program.
          </p>

          <p className="text-gray mt-3">
            Wouldn’t you like to make income on the side? Are you a student, a worker, job seeker, or you just seek additional income?
          </p>

          <p className="text-gray mt-3">
            Mile9ine terminal referral is your chance to earn some income on the side. Get national bus/car terminals to sign up via your Mile9ine referral link and you get 0.1% of the transaction value of each ticket purchased at that terminal for 3 months. Easy-peasy!
          </p>

          <p className="text-gray mt-3">
            A few details to note;
          </p>

          <ol className="mt-3 mb-3">
            <li>Sign in to your Mile9ine account or sign up to get one, click your profile to find your referral link.</li>
            <li>Click “copy” and you’re ready to start!</li>
            <li>Send this link or visit as many bus/car terminals you know. Convince the manager to sign up onto the Mile9ine online ticketing platform by filling out a form on the website.</li>
            <li>Guide them on how the setup is done and do follow ups for the next few weeks while encouraging them to ensure their customers make use of the platform.</li>
            <li>Get feedback to help make Mile9ine better.</li>
            <li>Be passionate, reliable and ready to assist.</li>
            <li>Remember you only earn income when bus/car terminal(s) make online ticket sales.</li>
            <li>Relax and watch your income trickle into your wallet.</li>
            <li>Mile9ine reserves the right to revoke this referral program if there’s reason to believe your referral link is used fraudulently.</li>
          </ol>
            </section>*/}
      </PolicyModal>
    </Fragment>
  )
}

export default UserSignUp
