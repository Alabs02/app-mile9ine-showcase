import { Fragment, useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { withUser, withUserProfile } from '../../../recoil/parkUser';
import { userRideBookedSeatsAtom } from '../../../recoil/userRideBookedSeats';
import _, { isEmpty } from 'lodash';
import { formatTime, moneyFormat, slugify } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { userCurrentBeneficiaryAtom } from '../../../recoil/userCurrentBeneficiary';
import { withUserAgent } from '../../../recoil/ParkAgent';
import { getUserTypeAtom } from '../../../recoil/getUserType'
import { catchAxiosErrors, transformToFormData, getToken } from '../../../utils';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import Modal from 'react-pure-modal';
import { CgClose } from 'react-icons/cg';
import PropTypes from 'prop-types';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import './SelectRideSeats.css';

export const CurrentBeneficiary = ({ beneficiaryData }) => {

  const [resetBeneficiary, setResetBeneficiary] = useRecoilState(userCurrentBeneficiaryAtom);
  const agentDetails = useRecoilValue(withUserAgent);
  console.log('Sidebar State:', agentDetails);
  console.log('Beneficiary', resetBeneficiary);

  return (
    <Fragment>
      <div>
        <div>
          <h5>Beneficiary:</h5>
          <h6>{_.get(beneficiaryData, 'name', null)}</h6>
          <div className='badge badge-light'>{_.get(beneficiaryData, 'email', null)}</div>
        </div>
        <button onClick={() => setResetBeneficiary(null)} type="button" className="btn btn-success btn-sm mt-2">Clear Beneficiary</button>
      </div>
    </Fragment>
  );
}

export const StaffBookingCode = ({ staffBookingCode }) => {
  
  const copyToClipboard = (text) => { 
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setTimeout(() => {  
      toast.success('Copied to clipboard');
    }, 500);
  }

  return (
    <Fragment>
      <h5>Booking Code</h5>
      <h6 className="font-w800">{staffBookingCode}</h6>
      <button onClick={() => copyToClipboard(staffBookingCode)} className="btn btn-sm btn-danger mt-1">Copy Code</button>
    </Fragment>
  );
}

const SelectRideSeats = ({ formData, summary }) => {

  const history = useHistory();
  const userProfile = useRecoilValue(withUserProfile);
  const userDetails = useRecoilValue(withUser);
  const [beneficiary, setBeneficiary] = useRecoilState(userCurrentBeneficiaryAtom); 
  const [userType, setUserType] = useRecoilState(getUserTypeAtom);
  console.log(userType);
  
  const [seating_positions, setSeatingPositions] = useState([]);
  const availableSeats = useRecoilValue(userRideBookedSeatsAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  console.log('FormData:', formData);
  console.log('Availables:', availableSeats);
  console.log('Profile', userProfile);
  console.log('Details', userDetails);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const increaseFare = (fare) => {
    const newFare = fare * _.get(summary, 'return_percentage', 0);
    return newFare;
  }  

  const flutterwaveConfig = {
    public_key: process.env.REACT_APP_WAVE_PUB_KEY,
    tx_ref: Date.now(),
    currency: 'NGN',
    payment_options: `card,mobilemoney,ussd`,
    amount: (_.get(formData, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) : (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) + increaseFare(formData.fare_amount*formData.seats),
    customer: {
      email: (beneficiary === null || undefined) ? _.get(userDetails, 'email', null) : _.get(beneficiary, 'email', null),
      phone_number: (beneficiary === null || undefined) ? _.get(userProfile, 'contact', null) : _.get(beneficiary, 'phone', null),
      name: (beneficiary === null || undefined) ? _.get(userDetails, 'name', null) : _.get(beneficiary, 'name', null),
    },
    customizations: {
      title: 'BOOK A RIDE',
      description: `Paying for bus ticket!`,
      logo: 'https://app.mile9ine.com/images/logo.png'
    }
  }

  const handleBookRide = useFlutterwave(flutterwaveConfig);

  useEffect(() => {
    console.log(formData?.busId);
    console.log('Selected Seats:', seating_positions);
  }, [seating_positions]);

  const choosePosition = (position, index, element) => {
    const busSeat = document.getElementById(element);
    if (availableSeats[index]?.booked === false) {
      if (busSeat.classList.contains("bus-ride__selected")) {
        busSeat.classList.remove("bus-ride__selected");
        setSeatingPositions(seating_positions.filter(item => item !== position));
      } else {
        if (seating_positions.length < +_.get(formData, 'seats', 0)) {
          busSeat.classList.add("bus-ride__selected");
          setSeatingPositions(prevItems => [...prevItems, position]);
        } else {
          toast.warning(`You have exceeded the intended number of seats!`);
        }
      }
    }
  }

  const bookForCustomer = async () => {
    if ((+_.get(formData, 'seats', 0) - seating_positions.length) === 0) {
      setIsBooking(true);
      postRequest(`/park_agent/book-for-customer`, transformToFormData({
        seats: _.get(formData, 'seats', null),
        fare_amount: (_.get(formData, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) : (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) + increaseFare(formData.fare_amount*formData.seats),
        leaving_date: _.get(formData, 'leaving_date', null),
        returning_date: (_.get(formData, 'returning_date', null) === null) ? _.get(formData, 'leaving_date', null) : _.get(formData, 'returning_date', null),
        travel_type: _.get(formData, 'travel_type', null),
        ride_bus_id: _.toInteger(_.get(formData, 'busId', null)),
        seating_positions: [...seating_positions],
        name: _.get(formData, 'name', null),
        email: _.get(formData, 'email', null),
        phone_number: _.get(formData, 'phone_number', null),
        address: _.get(formData, 'address', null),
        next_kin_name: _.get(formData, 'next_kin_name', null),
        next_kin_contact: _.get(formData, 'next_kin_contact', null),
        next_kin_address: _.get(formData, 'next_kin_address', null),
      }), {
        headers: { authorization: `Bearer ${await getToken()}` }
      }).then((res) => {
        setIsBooking(false);
        toast.success(`Booked Successfully!`);
    
        toast.success(<StaffBookingCode staffBookingCode={res.data.booking.booking_code} />, {
          autoClose: false,
          position: 'top-center',
        });

        setTimeout(() => {
          setIsModalOpen(false);
          history.push(`/park/staff/dashboard`);
        }, 1000);
      }).catch(err => {
        catchAxiosErrors(err, setIsBooking, null);
      });
    } else {
      toast.warning(`You have ${_.get(formData, 'seats', 0)-seating_positions.length} seat left to select!`);
    }
  }

  useEffect(() => {
    console.log(beneficiary);
    if (beneficiary !== null) {
      toast.success(
        <CurrentBeneficiary beneficiaryData={beneficiary} />,
        {
          autoClose: false,
        }
      );
    } else {
      console.log('No Beneficiary!')
    }
  }, [beneficiary]);

  return (
    <Fragment>
      <div className="d-app-flex">
        <h4 className="overline text-uppercase font-14">Select Seats</h4>
      </div>

      <div className="row">
        <div className="col-md-9 col-sm-12">
          <div className="bus-ride">
            <div className="bus-ride__grid">
              {availableSeats.map((busRide, index) => (
                <div onClick={() => choosePosition(_.get(busRide, 'seat_position', 0), index, `bus_ride_${index}`)} key={index} id={`bus_ride_${index}`} className={`${_.get(busRide, 'booked', null) == false ? 'bus-ride__seat' : 'bus-ride__seat bus-ride__taken'} bus-ride__seat`}>
                  {_.get(busRide, 'seat_position', 0)}
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex w-100 justify-content-end mt-3">
            <button onClick={toggleModal} type="button" className="btn btn-primary px-5 rounded-md">Proceed</button>

              <Modal
                isOpen={isModalOpen}
                scrollable={true}
                draggable={false}
                portal={false}
                className="custom-modal"
                closeButton={<CgClose onClick={toggleModal} size={20} className="text-muted" />}
                onClose={() => {
                  setIsModalOpen(false);
                  return true;
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title m-0">Booking Summary</h5>
                </div>
                <div className="modal-body">
                  <div className="d-flex flex-sm-column flex-md-row justify-content-md-between justify-content-sm-start  align-items-center mb-2">
                    <div>
                      <h5>Departure Time</h5>
                      <div className="badge badge-danger light">{formatTime(_.get(summary, 'departure_time', null))}</div>
                    </div>
                  </div>

                  <div className="d-flex flex-sm-column flex-md-row justify-content-md-between justify-content-sm-start  align-items-center">
                    <div>
                      <h5>Starting Point</h5>
                      <div className="badge badge-light">{_.get(summary, 'starting_point', null)}</div>
                    </div>
                    <div>
                      <h5>Destination</h5>
                      <div className="badge badge-light">{_.get(summary, 'destination', null)}</div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>Seat Number(s)</h5>
                      <p>[{seating_positions.toString()}] Seats</p>
                    </div>
                    <div>
                      <h5>Price</h5>
                      <div className="badge badge-danger">{moneyFormat.to((_.get(formData, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) : (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) + increaseFare(formData.fare_amount*formData.seats))}</div>
                    </div>
                  </div>

                  {(userType !== 'agent') &&
                    <div className="d-flex w-100 justify-content-end mt-4">
                      <button
                        onClick={() => {
                          if ((+_.get(formData, 'seats', 0) - seating_positions.length) === 0) {
                            handleBookRide({
                              callback: async (response) => {
                                console.log(response);
                                if (beneficiary === null && response?.status === "successful") {
                                  postRequest(`/park_user/booking/${_.get(userProfile, 'ref', null)}`, transformToFormData({
                                    seats: _.get(formData, 'seats', null),
                                    fare_amount: (_.get(formData, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) : (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) + increaseFare(Number(_.get(formData, 'fare_amount', 0))*Number(_.get(formData, 'seats', 0))),
                                    leaving_date: _.get(formData, 'leaving_date', null),
                                    returning_date: (_.get(formData, 'returning_date', null) === null) ? _.get(formData, 'leaving_date', null) : _.get(formData, 'returning_date', null),
                                    travel_type: _.get(formData, 'travel_type', null),
                                    transaction_id: response?.transaction_id,
                                    tx_ref: response?.tx_ref,
                                    amount: (_.get(formData, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) : (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) + increaseFare(Number(_.get(formData, 'fare_amount', 0))*Number(_.get(formData, 'seats', 0))),
                                    ride_bus_id: _.toInteger(_.get(formData, 'busId', null)),
                                    seating_positions: [...seating_positions],
                                  }), {
                                    headers: { authorization: `Bearer ${await getToken()}` }
                                  }).then((res) => {
                                    console.log('Data For User:', res);
                                    toast.success(`Booked Successfully!`);
                                    closePaymentModal();
                                    setTimeout(() => {
                                      window.location.reload(history.push(`/park/${slugify(_.get(userDetails, 'name', null))}/booked-rides`));
                                    }, 2000);
                                  }).catch(err => {
                                    catchAxiosErrors(err, null, null);
                                    closePaymentModal();
                                  });
                                } else if (beneficiary !== null && typeof beneficiary === 'object') {
                                  postRequest(`/park_user/booking/book-for-beneficary/${_.get(userProfile, 'ref', null)}`, transformToFormData({
                                    seats: _.get(formData, 'seats', null),
                                    fare_amount: (_.get(formData, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) : (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) + increaseFare(Number(_.get(formData, 'fare_amount', 0))*Number(_.get(formData, 'seats', 0))),
                                    leaving_date: _.get(formData, 'leaving_date', null),
                                    returning_date: (_.get(formData, 'returning_date', null) === null) ? _.get(formData, 'leaving_date', null) : _.get(formData, 'returning_date', null),
                                    travel_type: _.get(formData, 'travel_type', null),
                                    transaction_id: response?.transaction_id,
                                    tx_ref: response?.tx_ref,
                                    amount: (_.get(formData, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) : (_.toNumber(_.get(formData, 'fare_amount', 0))*_.get(formData, 'seats', 0)) + increaseFare(Number(_.get(formData, 'fare_amount', 0))*Number(_.get(formData, 'seats', 0))),
                                    beneficiary_id: beneficiary.id,
                                    ride_bus_id: _.toInteger(_.get(formData, 'busId', null)),
                                    seating_positions: seating_positions
                                  }), {
                                    headers: { authorization: `Bearer ${await getToken()}` }
                                  }).then((res) => {
                                    console.log('Form:', res);
                                    console.log('Beneficiary:', beneficiary);
                                    toast.success(`Booked Successfully, Details sent to beneficiary!`);
                                    setBeneficiary(null);
                                    closePaymentModal();
                                    setTimeout(() => {
                                      window.location.reload(history.push(`/park/${slugify(_.get(userDetails, 'name', null))}/booked-rides`));
                                    }, 2000);
                                  }).catch(err => {
                                    catchAxiosErrors(err, null, null);
                                    closePaymentModal();
                                  });
                                }
                              }
                            })
                          } else {
                            toast.warning(`You have ${_.get(formData, 'seats', 0)-seating_positions.length} left to select!`);
                          }
                        }}
                        type="button"
                        className="btn add-menu-sidebar m-0 px-4">
                        <RiSecurePaymentFill className="mr-2" size={20} />
                        Proceed to Payment
                      </button>
                    </div>
                  }
                  {(userType === 'agent') && !isBooking 
                    ? <div className="d-flex mt-4 justify-content-end">
                          <button
                            type="button"
                            className="btn add-menu-sidebar m-0 px-5"
                            onClick={bookForCustomer}
                          >
                            <RiSecurePaymentFill className="mr-2" size={20} />
                            Book Now
                          </button>
                        </div> 
                    : (isBooking) ? <div className="text-muted text-right py-4">Booking...</div> : ``
                  }
                </div>
              </Modal>
          </div>
        </div>

        <div className="col-md-3 col-sm-12">
          <div className="d-flex align-items-center mb-2">
            <div className="indicator indicator__available mr-3"></div>
            <span className="font-16 letter__wide">Available Seat</span>
          </div>

          <div className="d-flex align-items-center mb-2">
            <div className="indicator indicator__selected mr-3"></div>
            <span className="font-16 letter__wide">Selected Seat</span>
          </div>

          <div className="d-flex align-items-center">
            <div className="indicator indicator__booked mr-3"></div>
            <span className="font-16 letter__wide">Booked Seat</span>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

SelectRideSeats.propTypes = {
  formData: PropTypes.object,
  summary: PropTypes.object,
}

export default SelectRideSeats;


