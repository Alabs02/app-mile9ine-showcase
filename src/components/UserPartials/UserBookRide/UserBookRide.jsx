import { Fragment, useEffect, useState } from 'react';
import { MdAirlineSeatReclineExtra, MdAirlineSeatReclineNormal } from 'react-icons/md';
import { FaRoad } from 'react-icons/fa';
import { GiCrossroad } from 'react-icons/gi';
import { object, string } from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import { withParksQuery } from '../../../recoil/getAllParks';
import _, { isEmpty } from 'lodash';
import LoadScripts from '../../../Hooks/loadScripts';
import { ThreeDots } from 'react-loading-icons';
import { catchAxiosErrors, transformToFormData, getToken, moneyFormat } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import { userBookingRideAtom } from '../../../recoil/userBookingRide';
import { userRideBookedSeatsAtom } from '../../../recoil/userRideBookedSeats';
import { userFareAmtAtom } from '../../../recoil/userFareAmt';
import { userAvailableSeatsAtom } from '../../../recoil/userAvailableSeats';
import { userTempSeatNoAtom } from '../../../recoil/userTempSeatNo';
import { FaBus } from 'react-icons/fa';
import { HiLocationMarker, HiViewGrid } from 'react-icons/hi';
import SelectSeats from '../SelectSeats';
import './UserBookRide.css';
import 'animate.css';

const UserBookRide = () => {

  const [rideDetails, setRideDetails] = useRecoilState(userBookingRideAtom);
  const [bookedSeats, setBookSeats] = useRecoilState(userRideBookedSeatsAtom);
  const [fareAmount, setFareAmount] = useRecoilState(userFareAmtAtom);
  const [availableSeats, setAvailableSeats] = useRecoilState(userAvailableSeatsAtom);
  const [seatNo, setSeatNo] = useRecoilState(userTempSeatNoAtom);
  

  const parksArray = useRecoilValue(withParksQuery);
  console.log('In State:', rideDetails);
  console.log('Fare:', fareAmount);

  // Fields
  const [park_id, setParkId] = useState("");
  const [ride_id, setRideId] = useState(0);
  const [ride_bus_id, setRideBusId] = useState(0);
  const [seats, setSeats] = useState(1);
  const [leaving_date, setLeavingDate] = useState("");
  const [returning_date, setReturningDate] = useState(null);

  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [isAvailable, setIsAvailable] = useState(false);
  // const [buses, setBuses] = useState([]);
  // const [isVisible, setIsVisible] = useState(false);

  // const isValidCheck = () => {
  //   if(
  //     park_id 
  //     && ride_id
  //     && +ride_id > 0
  //     && seats
  //     && leaving_date !== ""
  //   ) {
  //     setIsValid(true);
  //   } else {
  //     setIsValid(false);
  //   }
  // }

  // const getBusRides = () => {
  //   if (park_id && ride_id) {
  //     let result = (parksArray[+park_id]?.park_rides).find( ({ id }) => +id === +ride_id );
  //     setBuses(_.get(result, 'buses', null));
  //     setIsVisible(true)
  //     console.log('Buses', _.get(result, 'buses', null));
  //   } else {
  //     setIsVisible(false)
  //   }
  // }

  useEffect(() => {
    isValidCheck();
    getBusRides();    
    console.log(park_id, ride_id, seats, leaving_date);
  }, [park_id, ride_id, seats, leaving_date]);

  const getBookingInfo = async () => {
    try {
      setIsDisabled(true);
      setIsLoading(true);

      const { data, status, statusText } = await postRequest(`/park_user/get-ride-details`, transformToFormData({
        ride_bus_id: ride_bus_id,
        leaving_date: leaving_date,
        returning_date: (returning_date === null) ? leaving_date : returning_date, 
        number_of_seats: seats
      }), { headers: {authorization: `Bearer ${await getToken()}`} });

      if (data) {
        console.log(data, status, statusText);
        setRideDetails(data?.ride_bus);
        setBookSeats(_.get(data, 'booked_seats.booked_seats_data', null));
        setFareAmount(data?.fare_amount);
        setAvailableSeats(_.get(data, 'booked_seats.spaces_available', null));
        setSeatNo(seats);
        setIsDisabled(false);
        setIsLoading(false);
        console.log('Ensure Data is in state:', rideDetails, bookedSeats);
        toast.success(`Hurray! lets proceed to seats selection in order to complete your booking process.`);
        setTimeout(() => {
          setIsAvailable(true);
        }, 100);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading, setIsDisabled);
    }
  }


  return (
    <Fragment>
      {!isAvailable && <div className="row animate__animated animate__fadeIn">
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
                  <li className="nav-item">
                    <a className="nav-link active" id="tab-links" data-toggle="tab" href="#one_way">
                      <FaRoad className="mr-3" size={20} />
                      One Way
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" id="tab-links" data-toggle="tab" href="#round_trip">
                      <GiCrossroad className="mr-3" size={20} />
                      Round Trip
                    </a>
                  </li>
                </ul>

                <div className="tab-content">

                  <div className="tab-pane fade show active" id="one_way" role="tabpanel">
                   
                    <form className="mt-4">
                      <div className="row">
                        <h1>One Way</h1>
                      </div>

                      <div className="d-flex justify-content-end mt-4">
                        {isLoading
                          ? <ThreeDots className="animate__animated animate__pulse" height="1.4em" width="4em" stroke="#ec3238" />
                          : <button onClick={getBookingInfo} type="button" className={`btn btn-primary rounded-sm px-4 ${(isValid) ? "" : "hide"}`}>Proceed</button>
                        }
                      </div>
                    </form>
                      
                  </div>

                  <div className="tab-pane fade" id="round_trip" role="tabpanel">
                    <div className="pt-4">
                      <h1>Round Trip</h1>
                    </div>
                  </div>

                </div>
              
              </div>

            </div>
          </div>
        </div>
      </div>}

      {isAvailable && <div className="w-100 animate__animated animate__fadeIn">
        <div className="d-app-flex m-0 mb-3">
          <h4 className="saluation salutation__overline m-0">Bus Availability</h4>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                <div className="row row__flex">
                  <div className="col-md-3 col-sm-12">
                    <div className="bus__media">
                      <img className="bus__img" src="/images/bus.svg" />
                    </div>
                  </div>

                  <div className="col-md-3 col-sm-12">
                    <p>
                      <FaBus className="text-primary mr-3" size={25} />
                      <span>From  {_.get(rideDetails, 'park_ride.starting_point', null)}</span>
                    </p>

                    <p>
                      <HiLocationMarker className="text-primary mr-3" size={25} />
                      <span>To {_.get(rideDetails, 'park_ride.destination', null)}</span>
                    </p>
                  </div>

                  <div className="col-md-3 col-sm-12">
                    <p>
                      <MdAirlineSeatReclineNormal className="text-primary mr-2" size={35} />
                      <span className="font-14">{availableSeats} seats available</span>
                    </p>  
                  </div>

                  <div className="col-md-3 col-sm-12 text-center">
                    <div className="badge badge-danger price letter__tight mb-2 px-5">{moneyFormat.to(fareAmount)}</div>
                    <button className="btn bg-dark-yellow px-5">
                      <HiViewGrid className="mr-2" size={20} />
                      View Seats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {isAvailable && <SelectSeats seats={bookedSeats} selectSeatNo={seats} />}


    </Fragment>
  )
}

export default UserBookRide;
