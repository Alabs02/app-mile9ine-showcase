import { Fragment, useState } from 'react';
import { Formik, Form, Field, FastField, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdEventSeat } from 'react-icons/md';
import SelectRideSeats from '../../UserPartials/SelectRideSeats/SelectRideSeats';
import PropTypes from 'prop-types';
import { TextField } from '../../FormField';
import { postRequest } from '../../../utils/axiosClient';
import { userRideBookedSeatsAtom } from '../../../recoil/userRideBookedSeats';
import { useRecoilState } from 'recoil';
import { catchAxiosErrors } from '../../../utils';
import './AgentAddCustomerDetails';

const initialFormVal = () => {
  return {
    name: '',
    email: '',
    phone_number: '',
    address: '',
    next_kin_name: '',
    next_kin_contact: '',
    next_kin_address: '',
  }
}

const schema = object().shape({
  name: string()
    .required('Required!'),
  email: string()
    .email('Invalid Email Address!')
    .required('Required!'),
  phone_number: string()
    .min(10, 'Too Short, Invalid Contact!')
    .max(14, 'Too Long, Invalid Contact!')
    .required('Required!'),
  address: string()
    .required('Required!'),
  next_kin_name: string()
    .required('Required!'),
  next_kin_contact: string()
    .min(10, 'Too Short, Invalid Contact!')
    .max(14, 'Too Long, Invalid Contact!')
    .required('Required!'),
  next_kin_address: string()
    .required('Required!'),
});

const AgentAddCustomerDetails = ({ bookFormData, summary }) => {

  const [isVisible, setIsVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [bookedSeats, setBookedSeats] = useRecoilState(userRideBookedSeatsAtom);

  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h5 className="m-0 text-muted fs-18 font-w500 overline text-uppercase">
                <BsFillPersonFill className="mr-2" size={25} />
                Add Customer Details
              </h5>
            </div>
            <div className="card-body">
              <Formik
                initialValues={initialFormVal()}
                validationSchema={schema}
                onSubmit={async (values) => {
                  try {
                    setCustomerData(values);
                    setIsVisible(false);
                    setIsFetching(true);

                    const { data } = await postRequest(`/park_user/get-ride-details`, {
                      ride_bus_id: _.toNumber(_.get(bookFormData, 'busId', null)),
                      leaving_date: _.get(bookFormData, 'leaving_date', null),
                      returning_date: _.get(bookFormData, 'returning_date', null),
                      number_of_seats: _.get(bookFormData, 'seats', null),
                    });

                    if (data) {
                      setBookedSeats(data?.booked_seats?.booked_seats_data);
                      setIsFetching(false);
                      setIsVisible(true);
                      console.log(data);
                    }
                  } catch (err) {
                    catchAxiosErrors(err, setIsFetching, null);
                  }
                }}
              >
                {props => (
                  <Form>
                    <div className="row text-left">
                      <div className="col-sm-12 col-md-6 mb-3">
                        <label htmlFor="name" className="text-label fs-5 m-0">Customer's Name</label>
                        <Field name="name" type="name" as={TextField} placeholder="e.g John Snow" />
                        <ErrorMessage name="name">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-6 mb-3">
                        <label htmlFor="email" className="text-label fs-5 m-0">Customer's Email</label>
                        <Field name="email" type="email" as={TextField} placeholder="e.g mail@website.com" />
                        <ErrorMessage name="email">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-6 mb-3">
                        <label htmlFor="phone_number" className="text-label fs-5 m-0">Customer's Phone Contact</label>
                        <Field name="phone_number" type="tel" as={TextField} placeholder="e.g 09012345678" />
                        <ErrorMessage name="phone_number">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-6 mb-3">
                        <label htmlFor="address" className="text-label fs-5 m-0">Customer's Address</label>
                        <Field name="address" type="text" as={TextField} placeholder="e.g NY Main Street" />
                        <ErrorMessage name="address">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-6 mb-3">
                        <label htmlFor="next_kin_name" className="text-label fs-5 m-0">Next of Kin Name</label>
                        <Field name="next_kin_name" type="text" as={TextField} placeholder="e.g John Deo" />
                        <ErrorMessage name="next_kin_name">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-6 mb-3">
                        <label htmlFor="next_kin_contact" className="text-label fs-5 m-0">Next of Kin Contact</label>
                        <Field name="next_kin_contact" type="tel" as={TextField} placeholder="e.g 09087654321" />
                        <ErrorMessage name="next_kin_contact">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-6 mb-3">
                        <label htmlFor="next_kin_address" className="text-label fs-5 m-0">Next of Kin Address</label>
                        <Field name="next_kin_address" type="text" as={TextField} placeholder="e.g NY Main Street" />
                        <ErrorMessage name="next_kin_address">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                    </div>
                    <div className="mt-4 d-flex justify-content-end">
                      { !isFetching
                        ? <button type="submit" className="btn btn-primary">
                            <MdEventSeat className="mr-2" size={20} />
                            Select Seats
                          </button>
                        : <div className="text-muted m-0">Fetching Seats...</div>
                      }
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {isVisible && <SelectRideSeats 
        formData={{
          ...bookFormData,
          ...customerData,
        }}
        summary={summary}
      />}
    </Fragment>
  );
}

AgentAddCustomerDetails.prototype = {
  bookFormData: PropTypes.object,
  summary: PropTypes.object,
}

export default AgentAddCustomerDetails;
