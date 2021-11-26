import { Fragment, useState, useEffect} from 'react';
import _ from 'lodash';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { catchAxiosErrors, transformToFormData, getToken, moneyFormat, formatTime, stringSeparator, slugify } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { withUser, withUserProfile } from '../../../recoil/parkUser';
import PolicyModal from '../../core/PolicyModal';
import { useHistory } from 'react-router-dom';
import './CompleteCheckout.css';
import 'animate.css';

const createGuest = require('cross-domain-storage/guest');
const appStorage = createGuest(
  (process.env.NODE_ENV === 'production')
  ? (document.domain === 'app.mile9ine.com') ? 'https://mile9ine.com/accessStorage' : 'https://www.mile9ine.com/accessStorage'
  : 'http://localhost:3001/accessStorage'
);

const CompletedCheckout = () => {

  const history = useHistory();
  const userDetails = useRecoilValue(withUser);
  const userProfile = useRecoilValue(withUserProfile);
  const [payload, setPayload] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const removePayload = () => {
    appStorage.remove('payload', (err, val) => val);
    appStorage.remove('hasPayload', (err, val) => val);
  }

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const onClose = () => {
    setIsModalOpen(false);
    removePayload();
    return true;
  }
    
  const getPayload = () => appStorage.get('hasPayload', (err, val) => {
    if (!err && val === 'true') {
      appStorage.get('payload', (err, val) => {
        if (!err) {
          setPayload(JSON.parse(val));
          console.log('App Payload:', JSON.parse(val));
        }
      });
    }
  });
 
  useEffect(async () => {
    getPayload();
  }, []);

  useEffect(() => {
    if (payload !== (null || undefined && typeof payload === 'object')) {
      setTimeout(() => {
        if (payload.fare_amount) {
          toggleModal();
        }
        }, 1000);
    }
  }, [payload]); 
  
  const increaseFare = (fare) => {
    const newFare = fare * _.get(payload, 'return_percentage', 0);
    return newFare;
  }  

  const flutterwaveConfig = {
    public_key: process.env.REACT_APP_WAVE_PUB_KEY,
    tx_ref: Date.now(),
    currency: 'NGN',
    payment_options: `card,mobilemoney,ussd`,
    amount: (_.get(payload, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(payload, 'fare_amount', 0))*Number(_.get(payload, 'seats', 0))) : (_.toNumber(_.get(payload, 'fare_amount', 0))*Number(_.get(payload, 'seats', 0))) + increaseFare(Number(payload.fare_amount)*Number(payload.seats)),
    customer: {
      email: _.get(userDetails, 'email', null),
      phone_number: _.get(userProfile, 'contact', null),
      name: _.get(userDetails, 'name', null),
    },
    customizations: {
      title: 'BOOK A RIDE',
      description: `Paying for bus ticket!`,
      logo: 'https://app.mile9ine.com/images/logo.png'
    }
  }

  const handleBookRide = useFlutterwave(flutterwaveConfig);

  return (
    <Fragment>
      <PolicyModal 
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        onClose={onClose}
        title={'Payment Confirmation'}
      >

      <div className="modal-body">
        <div className="row">

          <div className="col-sm-12 col-md-6 mb-2">
            <h6 className="m-0">Departure Time</h6>
            <div className="badge badge-danger badge-xl">{formatTime(_.get(payload, 'departure_time', '00:00:00'))}</div>
          </div>

          <div className="col-sm-12 col-md-6 mb-2">
            <h6 className="m-0">Price</h6>
            <div className="badge badge-lg bg-dark-yellow">{moneyFormat.to(_.get(payload, 'actual_amount', null))}</div>
          </div>

          <div className="col-sm-12 col-md-6 mb-2">
            <h6 className="m-0">Departure Point</h6>
            <div className="badge badge-light">{_.get(payload, 'starting_point', null)}</div>
          </div>

          <div className="col-sm-12 col-md-6 mb-2">
            <h6 className="m-0">Destination</h6>
            <div className="badge badge-light">{_.get(payload, 'destination', null)}</div>
          </div>

          <div className="col-sm-12 col-md-6 mb-2">
            <h6 className="m-0">Selected Seats</h6>
            <div className="badge badge-danger light badge-lg">[ {_.toString(_.get(payload, 'seating_positions', null))} ]</div>
          </div>
        </div>


        <div className="d-flex justify-content-end mt-4">
          <button
            id="pay-user-ticket-button"
            className="btn add-menu-sidebar px-5 m-0"
            onClick={() => {
              handleBookRide({
                callback: async (response) => {
                  console.log('Response:', response);
                  if (response.status === "successful") {
                    postRequest(`/park_user/booking/${_.get(userProfile, 'ref', null)}`, transformToFormData({
                      seats: Number(_.get(payload, 'seats', null)),
                      fare_amount: (_.get(payload, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(payload, 'fare_amount', 0))*Number(_.get(payload, 'seats', 0))) : (_.toNumber(_.get(payload, 'fare_amount', 0))*Number(_.get(payload, 'seats', 0))) + increaseFare(Number(_.get(payload, 'fare_amount', 0))*Number(Number(_.get(payload, 'seats', 0)))),
                      leaving_date: _.get(payload, 'leaving_date', null),
                      returning_date: (_.get(payload, 'returning_date', null) === null) ? _.get(payload, 'leaving_date', null) : _.get(payload, 'returning_date', null),
                      travel_type: _.get(payload, 'travel_type', null),
                      transaction_id: response?.transaction_id,
                      tx_ref: response?.tx_ref,
                      amount: (_.get(payload, 'travel_type', null) === 'one_way') ? (_.toNumber(_.get(payload, 'fare_amount', 0))*Number(_.get(payload, 'seats', 0))) : (_.toNumber(_.get(payload, 'fare_amount', 0))*Number(_.get(payload, 'seats', 0))) + increaseFare(Number(_.get(payload, 'fare_amount', 0))*Number(Number(_.get(payload, 'seats', 0)))),
                      ride_bus_id: _.toInteger(_.get(payload, 'busId', null)),
                      seating_positions: [..._.get(payload, 'seating_positions', [])],
                    }), {
                      headers: { authorization: `Bearer ${await getToken()}` }
                    }).then((res) => {
                      console.log('Data For User:', res);
                      toast.success(`Booked Successfully!`);
                      closePaymentModal();
                      appStorage.remove('payload', (err, val) => {});
                      appStorage.remove('hasPayload', (err, val) => {});
                      setTimeout(() => {
                        window.location.reload(history.push(`/park/${slugify(_.get(userDetails, 'name', null))}/booked-rides`));
                      }, 2000);
                    }).catch(err => {
                      catchAxiosErrors(err, null, null);
                      closePaymentModal();
                    });
                  }
                }
              });
            }}
          >Pay Now</button>
        </div>

        
      </div>
      </PolicyModal>
      
    </Fragment>
  );
}

export default CompletedCheckout;
