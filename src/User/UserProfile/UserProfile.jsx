import { Fragment, useRef, useState, useEffect } from 'react';
import { Formik, Form, Field, FastField, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import LoadScripts from '../../Hooks/loadScripts';
import { withUserProfile, withUser, withWalletBalance } from '../../recoil/parkUser';
import { BsFillPersonFill } from 'react-icons/bs';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { RiProfileLine } from 'react-icons/ri';
import { FiCopy } from 'react-icons/fi';
import { ThreeDots } from 'react-loading-icons';
import _ from 'lodash';
import { TextField } from '../../components/FormField';
import { catchAxiosErrors, transformToFormData, getToken, checkGender } from '../../utils';
import { toast } from 'react-toastify';
import { postRequest } from '../../utils/axiosClient';
import { parkUserAtom } from '../../recoil/parkUser';
import './UserProfile.css';
import 'animate.css';

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

const initialFormVal = (profile, bio) => {
  return {
    name: (_.get(profile, 'name', null) !== (undefined || null) ? _.get(profile, 'name', null) : ""),
    email: (_.get(profile, 'email', null) !== (undefined || null) ? _.get(profile, 'email', null) : ""),
    address: (_.get(bio, 'address', null) !== (undefined || null) ? _.get(bio, 'address', null) : ""),
    next_kin_name: (_.get(bio, 'next_kin_name', null) !== (undefined || null) ? _.get(bio, 'next_kin_name', null) : ""),
    next_kin_contact: (_.get(bio, 'next_kin_contact', null) !== (undefined || null) ? _.get(bio, 'next_kin_contact', null) : ""),
    next_kin_address: (_.get(bio, 'next_kin_address', null) !== (undefined || null) ? _.get(bio, 'next_kin_address', null) : ""),
    gender: ''
  }
}

const updateProfileSchema = object().shape({
  name: string()
    .min(3, 'Too Short!')
    .max(70, 'Too Long!')
    .required('Required!'),
  email: string()
    .email('Invalid Email Address!')
    .required('Required!'),
  contact: string()
    .min(10, 'Too Short!')
    .max(11, 'Too Long!')
    .required('Required!'),
  address: string()
    .min(3, 'Too Short!')
    .max(150, 'Too Long!')
    .required('Required!'),
  next_kin_name: string()
    .min(3, 'Too Short!')
    .max(70, 'Too Long!')
    .required('Required!'),
  next_kin_contact: string()
    .min(10, 'Too Short!')
    .max(11, 'Too Long!')
    .required('Required!'),
  next_kin_address: string()
    .min(3, 'Too Short!')
    .max(150, 'Too Long!')
    .required('Required!'),
  gender: string()
    .required('Required!')
});

const UserProfile = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  const userProfile = useRecoilValue(withUserProfile);
  const userDetails = useRecoilValue(withUser);
  const userWallet = useRecoilValue(withWalletBalance);
  const [parkUser, setParkUser] = useRecoilState(parkUserAtom);
  const updateCardRef = useRef(null);

  const isProductionReady = process.env.NODE_ENV === 'production' ? true : false;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCollapse = () => {
    if (isCollapsed === false) {
      setIsCollapsed(true);
      setTimeout(() => {
        scrollToRef(updateCardRef);
      }, 50);
    } else {
      setIsCollapsed(false);
      window.scrollTo(0, 0);
    }
  }

  const copyRef = () => {
    let isProductionReady = process.env.NODE_ENV === 'production' ? true : false;
    const url = isProductionReady ? `${process.env.REACT_APP_LIVE_DOMAIN}register/park/${userProfile.ref}`
      : `${process.env.REACT_APP_lOCAL_DOMAIN}register/park/${userProfile.ref}`;
    navigator.clipboard.writeText(url);
    toast.success('Copied to Clipboard');
  }


  console.log('User Profile:', userProfile);
  console.log('User Details: ', userDetails);
  console.log('Wallet:', userWallet);

  return (
    <Fragment>
      <div className="d-app-flex mb-3">
        <h4 className="text-uppercase fs-5 overline m-0">My Profile</h4>

        <span onClick={toggleCollapse} className="add-menu-sidebar add__btn">
          <RiProfileLine size={'18px'} className="text-white mr-3" />
          <span>Update Profile</span>
        </span>
      </div>

      <div className="mt-3">
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="card-media profile__media m-0">
                  <div className="profile__avatar">
                    <img src={checkGender(_.get(userProfile, 'gender', null))} alt="avatar" className="card-img profile__img" />
                  </div>
                </div>

                <div className="card-copy mt-3">
                  <div className="d-flex justify-content-center mb-2">
                    <BsFillPersonFill className="text-primary mr-2" size={22} />
                    <span className="text-muted">{_.get(userDetails, 'name', null)}</span>
                  </div>

                  <div className="d-flex justify-content-center">
                    <HiOutlineMailOpen className="text-primary mr-2" size={22} />
                    <span className="text-muted">{_.get(userDetails, 'email', null)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="row">

                  <div className="col-sm-12 col-md-12 mb-2 mt-2">
                    <div className="panel bg-light shadow-sm p-2 rounded-sm">
                      <p className="m-0 text-uppercase font-w300 fs-6">My Wallet Balance:</p>
                      <p className="m-0">{_.get(userWallet, 'user_wallet', null)}</p>
                    </div>
                  </div>

                <div className="col-sm-12 col-md-4">
                  <div className="panel bg-light shadow-sm p-2 rounded-sm">
                    <p className="m-0 text-uppercase font-w300 fs-6">My Contact:</p>
                    <p className="m-0">{(_.get(userProfile, 'contact', null) !== null) ? _.get(userProfile, 'contact', null) : 'Not Available'}</p>
                  </div>
                </div>

                <div className="col-sm-12 col-md-4">
                  <div className="panel bg-light shadow-sm p-2 rounded-sm">
                    <p className="m-0 text-uppercase font-w300 fs-6">My Gender:</p>
                    <p className="m-0">{(_.get(userProfile, 'gender', null) !== null) ? _.get(userProfile, 'gender', null) : 'Not Available'}</p>
                  </div>
                </div>

                <div className="col-sm-12 col-md-4 mb-2">
                  <div className="panel bg-light shadow-sm p-2 rounded-sm">
                    <p className="m-0 text-uppercase font-w300 fs-6">My Address:</p>
                    <p className="m-0">{(_.get(userProfile, 'address', null) !== null) ? _.get(userProfile, 'address', null) : 'Not Available'}</p>
                  </div>
                </div>

                <div className="col-sm-12 col-md-4 mb-2">
                  <div className="panel bg-light shadow-sm p-2 rounded-sm">
                    <p className="m-0 text-uppercase font-w300 fs-6">Next of Kin's Name:</p>
                    <p className="m-0">{(_.get(userProfile, 'next_kin_name', null) !== null) ? _.get(userProfile, 'next_kin_name', null) : 'Not Available'}</p>
                  </div>
                </div>

                <div className="col-sm-12 col-md-4 mb-2">
                  <div className="panel bg-light shadow-sm p-2 rounded-sm">
                    <p className="m-0 text-uppercase font-w300 fs-6">Next of Kin's Contact:</p>
                    <p className="m-0">{(_.get(userProfile, 'next_kin_contact', null) !== null) ? _.get(userProfile, 'next_kin_contact', null) : 'Not Available'}</p>
                  </div>
                </div>

                <div className="col-sm-12 col-md-4 mb-2">
                  <div className="panel bg-light shadow-sm p-2 rounded-sm">
                    <p className="m-0 text-uppercase font-w300 fs-6">Next of Kin's Address:</p>
                    <p className="m-0">{(_.get(userProfile, 'next_kin_address', null) !== null) ? _.get(userProfile, 'next_kin_address', null) : 'Not Available'}</p>
                  </div>
                </div>

                </div>

                <div className="row mt-3">
                  <h6 className="m-0 px-4 text-uppercase">Referal URL</h6>
                  <div className="col-xl-12">
                    <div className="card bg-light">
                      <div className="card-body py-3 w-100 d-flex flex-column flex-md-row justify-content-md-between justify-content-sm-center align-items-center">
                        <p className="m-0 font-weight-bold">{isProductionReady ? `${process.env.REACT_APP_LIVE_DOMAIN}` : `${process.env.REACT_APP_lOCAL_DOMAIN}`}register/park/<span className="badge badge-dark">{_.get(userProfile, 'ref', null)}</span></p>
                        
                        <div onClick={copyRef} type="button" className="pointer bg-primary shadow icon-hover-toggle p-2 rounded-circle">
                          <FiCopy className="text-white"  size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      { isCollapsed && 
        <div ref={updateCardRef} className="mt-5">
          <h4 className="text-uppercase fs-5 overline m-0 mb-2">Update Profile</h4>

          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body text-left">
                  <Formik
                    initialValues={initialFormVal(userDetails, userProfile)}
                    validationSchema={updateProfileSchema}
                    onSubmit={ async (values) => {
                      try {
                        setIsLoading(true);
                        const { data, status, statusText } = await postRequest(`/park_user/update-user-profile`, transformToFormData(values), {
                          headers: { authorization: `Bearer ${ await getToken() }` }
                        });

                        if (data) {
                          console.log(data, status, statusText);
                          setParkUser(data?.user);
                          toast.success('Updated Successfully!');
                          setIsLoading(false);
                          setIsCollapsed(true);
                          setTimeout(() => {
                            window.scrollTo(0, 0);
                          }, 0);
                        }
                      } catch (err) {
                        catchAxiosErrors(err, setIsLoading, null);
                      }
                    }}
                  >
                    {props => (
                      <Form>
                        <div className="row">

                          <div className="col-sm-12 mb-2">
                            <h5 className="overline fs-6 text-uppercase">Personal Details</h5>
                          </div>

                          <div className="col-md-6 col-sm-12 mb-3">
                            <label htmlFor="name" className="text-label fs-5 m-0">My Name</label>
                            <Field type="text" name="name" as={TextField} placeholder="e.g John Snow" />
                            <ErrorMessage name="name">
                              {msg => <div className="error-msg text-danger">{msg}</div>}
                            </ErrorMessage>
                          </div>

                          <div className="col-md-6 col-sm-12 mb-3">
                            <label htmlFor="email" className="text-label fs-5 m-0">My Email</label>
                            <Field text="email" name="email" as={TextField} placeholder="e.g snow@example.com" />
                            <ErrorMessage name="email">
                              {msg => <div className="error-msg text-danger">{msg}</div>}
                            </ErrorMessage>
                          </div>

                          <div className="col-md-6 col-sm-12 mb-3">
                            <label htmlFor="contact" className="text-label fs-5 m-0">My contact</label>
                            <Field type="tel" name="contact" as={TextField} placeholder="e.g 07012345678" />
                            <ErrorMessage name="contact">
                              {msg => <div className="error-msg text-danger">{msg}</div>}
                            </ErrorMessage>
                          </div>

                          <div className="col-sm-12 col-md-6 mb-3">
                            <label htmlFor="gender" className="text-label fs-5 m-0">My Gender</label>
                            <FastField name="gender">
                              {({ field }) => (
                                <select className="form-control" {...field}>
                                  <option defaultValue="">Choose...</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              )}
                            </FastField>
                            <ErrorMessage name="gender">
                              {msg => <div className="error-msg text-danger">{msg}</div>}
                            </ErrorMessage>
                          </div>

                          <div className="col-md-6 col-sm-12 mb-3">
                            <label htmlFor="address" className="text-label fs-5 m-0">My Address</label>
                            <Field type="text" name="address" as={TextField} placeholder="e.g NY Main St." />
                            <ErrorMessage name="address">
                              {msg => <div className="error-msg text-danger">{msg}</div>}
                            </ErrorMessage>
                          </div>

                          <div className="col-sm-12 mt-4 mb-2">
                            <h5 className="overline fs-6 text-uppercase">Next of Kin Details</h5>
                          </div>

                          <div className="col-md-6 col-sm-12 mb-3">
                            <label htmlFor="next_kin_name" className="text-label fs-5 m-0">Name Of Next Of Kin</label>
                            <Field type="text" name="next_kin_name" as={TextField} placeholder="e.g John Snow" />
                            <ErrorMessage name="next_kin_name">
                              {msg => <div className="error-msg text-danger">{msg}</div>}
                            </ErrorMessage>
                          </div>

                          <div className="col-md-6 col-sm-12 mb-3">
                            <label htmlFor="next_kin_contact" className="text-label fs-5 m-0">Contact Of Next Of Kin</label>
                            <Field type="tel" name="next_kin_contact" as={TextField} placeholder="e.g 07012345678" />
                            <ErrorMessage name="next_kin_contact">
                              {msg => <div className="error-msg text-danger">{msg}</div>}
                            </ErrorMessage>
                          </div>

                          <div className="col-md-6 col-sm-12 mb-3">
                            <label htmlFor="next_kin_address" className="text-label fs-5 m-0">Address Of Next Of Kin</label>
                            <Field type="text" name="next_kin_address" as={TextField} placeholder="e.g NY Main St." />
                            <ErrorMessage name="next_kin_address">
                              {msg => <div className="error-msg text-danger">{msg}</div>}
                            </ErrorMessage>
                          </div>

                        </div>

                        <div className="mt-4 d-flex justify-content-end align-items-center">
                          { isLoading
                            ? <ThreeDots className="ml-3 rounded-sm animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
                            : <button type="submit" disabled={(_.isEmpty(props.errors) && props.isValid) 
                                ? false : true} className="btn btn-primary animate__animated animate__pulse">Update Profile</button>
                          }
                        </div>

                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      

    </Fragment>
  );
}

export default UserProfile;
