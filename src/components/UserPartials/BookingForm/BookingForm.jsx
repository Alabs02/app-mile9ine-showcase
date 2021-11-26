import { Fragment, useState, useEffect } from 'react';
import { FaRoad } from 'react-icons/fa';
import { GiCrossroad } from 'react-icons/gi';
import { MdAirlineSeatReclineExtra, MdEventSeat } from 'react-icons/md';
import { IoPersonAddSharp } from 'react-icons/io5';
import _, { isEmpty } from 'lodash';
import { withUser, withUserProfile } from '../../../recoil/parkUser';
import { useRecoilValue, useRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import SelectRideSeats from '../SelectRideSeats/SelectRideSeats';
import { catchAxiosErrors } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { userRideBookedSeatsAtom } from '../../../recoil/userRideBookedSeats';
import { getUserTypeAtom } from '../../../recoil/getUserType'
import { AgentAddCustomerDetails } from '../../AgentPartials';
import PropTypes from 'prop-types';
import './BookingForm.css';


const BookingForm = ({ busId, rideAmount, summary }) => {

  const [bookedSeats, setBookedSeats] = useRecoilState(userRideBookedSeatsAtom);
  const [userType, setUserType] = useRecoilState(getUserTypeAtom);
  console.log('User Type:', userType);
  console.log('Summary:', summary);

  const [seats, setSeats] = useState(1);
  const [leaving_date, setLeavingDate] = useState(null);
  const [returning_date, setReturningDate] = useState(null);
  const [fare_amount, setFareAmount] = useState(+rideAmount);
  const [travel_type, setTravelType] = useState('one_way');
  const [amount, setAmount] = useState(0);
  const [ride_bus_id, setRideBusId] = useState(busId);
  const [busSeats, setBusSeats] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [previewForm, setPreviewForm] = useState(false);
  const [isDateValid, setIsDateValid] = useState(true);

  // User Data
  const userProfile = useRecoilValue(withUserProfile);
  const userDetails = useRecoilValue(withUser);
  console.log('Profile', userProfile);
  console.log('Details', userDetails);

  const previewSeats = async (travel_type) => {
    try {
      if (isDateValid) {
        setBusSeats(false);
        setIsFetching(true);
        setTravelType(travel_type);

        const { data, status, statusText } = await postRequest(`/park_user/get-ride-details`, {
          ride_bus_id: +busId,
          leaving_date: leaving_date,
          returning_date: returning_date,
          number_of_seats: +seats,
        });

        if (data) {
          setBookedSeats(data?.booked_seats?.booked_seats_data);
          setIsFetching(false);
          setBusSeats(true);
          console.log(data);
        }
      } else {
        toast.warning('LEAVING Date cannot be ahead of RETURNING date, Please select a valid date');
      }
    } catch (err) {
      catchAxiosErrors(err, setIsFetching, null);
    }
  }

  const compareDates = (date1, date2) => {
    const date1_ = new Date(date1);
    const date2_ = new Date(date2);
    let res = date1_.getTime() - date2_.getTime();
    console.log('Results:', date1_.getTime() - date2_.getTime());
    console.log('Res:', Math.sign(res) === -1 ? false : true);
    return Math.sign(res) === -1 ? false : true;
  }

  useEffect(() => {
    if (leaving_date && returning_date) {
      setIsDateValid(compareDates(returning_date, leaving_date));
      setTimeout(() => {
        console.log('State:', isDateValid);
      }, 500)
    }
  }, [leaving_date, returning_date]);

  const previewCustomerDetails = (travel_type) => {
    if (isDateValid) {
      setTravelType(travel_type);
      setTimeout(() => {
        setPreviewForm(true);
      }, 10);
    } else {
      toast.warning('LEAVING Date cannot be ahead of RETURNING date, Please select a valid date');
    }
    
  }

  const travelType = (type) => {
    setLeavingDate(null);
    setReturningDate(null);
    setTravelType(type);
    setSeats(1);
  }

  if (userType !== 'agent') {
    useEffect(() => {
      setBusSeats(false);
    }, [seats, leaving_date, returning_date]);
  }

  return (
    <Fragment>
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title text-muted m-0 letter__wide">
                  <MdAirlineSeatReclineExtra className="mr-2" size={24} />
                  Book Seat
                </h5>
              </div>

              <div className="card-body">
                <div className="default-tab">

                  <ul className="nav nav-tabs" role="tablist">
                    <li onClick={() => travelType('one_way')} className="nav-item">
                      <a className="nav-link active" id="tab-links" data-toggle="tab" href="#one_way">
                        <FaRoad className="mr-3" size={20} />
                        One Way
                      </a>
                    </li>

                    <li onClick={() => travelType('return')} className="nav-item">
                      <a className="nav-link" id="tab-links" data-toggle="tab" href="#round_trip">
                        <GiCrossroad className="mr-3" size={20} />
                        Round Trip
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content text-left">

                    <div className="tab-pane fade show active" id="one_way" role="tabpanel">
                      <form action="" className="mt-4">
                        <div className="row">
                          
                          <div className="col-sm-12 col-md-6 mb-3">
                            <label htmlFor="" className="text-label fs-5 m-0">Departure Date</label>
                            <input onChange={e => setLeavingDate(e.target.value)} value={leaving_date} type="date" className="form-control" />
                          </div>

                          <div className="col-sm-12 col-md-6 mb-3">
                            <label htmlFor="" className="text-label fs-5 m-0">Choose Seat</label>
                            <select onChange={e => setSeats(e.target.value)} value={seats} className="form-control">
                              <option value={1}>One Seat | 1</option>
                              <option value={2}>Two Seats | 2</option>
                              <option value={3}>Three Seats | 3</option>
                              <option value={4}>Four Seats | 4</option>
                              <option value={5}>Five Seats | 5</option>
                              <option value={6}>Six Seats | 6</option>
                              <option value={7}>Seven Seats | 7</option>
                              <option value={8}>Eight Seats | 8</option>
                              <option value={9}>Nine Seats | 9</option>
                              <option value={10}>Ten Seats | 10</option>
                            </select>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end mt-4">
                          {(userType === 'agent')
                            ? <button 
                                onClick={() => previewCustomerDetails('one_way')}
                                type="button" 
                                className="btn btn-primary"
                              >
                                <IoPersonAddSharp className="mr-2" size={20} />
                                Add Customer Details
                              </button>
                            : <button 
                                onClick={() =>  previewSeats('one_way')}
                                type="button" 
                                className="btn btn-primary"
                              >
                                <MdEventSeat className="mr-2" size={20} />
                                Select Seats
                              </button>
                          }
                        </div>
                      </form>
                    </div>

                    <div className="tab-pane fade" id="round_trip" role="tabpanel">
                      <form action="" className="mt-4">
                        <div className="row">
                          <div className="col-sm-12 col-md-6 mb-3">
                            <label htmlFor="" className="text-label fs-5 m-0">Departure Date</label>
                            <input onChange={e => setLeavingDate(e.target.value)} value={leaving_date} type="date" className="form-control" />
                          </div>

                          <div className="col-sm-12 col-md-6 mb-3">
                            <label htmlFor="" className="text-label fs-5 m-0">Returning Date</label>
                            <input onChange={e => setReturningDate(e.target.value)} value={returning_date} type="date" className="form-control" />
                          </div>

                          <div className="col-sm-12 col-md-12 mb-3">
                            <label htmlFor="" className="text-label fs-5 m-0">Choose Seat</label>
                            <select onChange={e => setSeats(e.target.value)} value={seats} className="form-control">
                              <option value={1}>One Seat | 1</option>
                              <option value={2}>Two Seats | 2</option>
                              <option value={3}>Three Seats | 3</option>
                              <option value={4}>Four Seats | 4</option>
                              <option value={5}>Five Seats | 5</option>
                              <option value={6}>Six Seats | 6</option>
                              <option value={7}>Seven Seats | 7</option>
                              <option value={8}>Eight Seats | 8</option>
                              <option value={9}>Nine Seats | 9</option>
                              <option value={10}>Ten Seats | 10</option>
                            </select>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                          {(userType === 'agent')
                            ? <button 
                                onClick={() => previewCustomerDetails('return')}
                                type="button" 
                                className="btn btn-primary"
                              >
                                <IoPersonAddSharp className="mr-2" size={20} />
                                Add Customer Details
                              </button>
                            : <button 
                                onClick={() =>  previewSeats('return')}
                                type="button" 
                                className="btn btn-primary"
                              >
                                <MdEventSeat className="mr-2" size={20} />
                                Select Seats
                              </button>
                          }
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(userType === 'agent') && previewForm && <AgentAddCustomerDetails 
          bookFormData={{
            seats,
            fare_amount,
            leaving_date,
            returning_date,
            travel_type,
            busId,
          }}
          summary={summary}
        />}

        {(userType !== 'agent') && busSeats && <SelectRideSeats 
          formData={{
            seats,
            fare_amount,
            leaving_date,
            returning_date,
            travel_type,
            busId,
          }}
          summary={summary}
        />}
    </Fragment>
  );
}

BookingForm.propTypes = {
  busId: PropTypes.number, 
  rideAmount: PropTypes.number, 
  summary: PropTypes.object
}

export default BookingForm;
