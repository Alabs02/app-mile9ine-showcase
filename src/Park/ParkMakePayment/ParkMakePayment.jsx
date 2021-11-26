import { Fragment, useState } from 'react';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { moneyFormat, transformToFormData, getToken, catchAxiosErrors } from '../../utils';
import { withPark, withParkAdmin } from '../../recoil/parkAdmin';
import { useRecoilValue } from 'recoil';
import { postRequest } from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import _ from 'lodash';
import './ParkMakePayment.css';

const ParkMakePayment = () => {

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const parkDetails = useRecoilValue(withPark);
  const parkAdmin = useRecoilValue(withParkAdmin);
  console.log('Park:', parkDetails);
  console.log('Park Admin:', parkAdmin);

  const flutterwaveConfig = {
    public_key: process.env.REACT_APP_WAVE_PUB_KEY,
    tx_ref: Date.now(),
    currency: 'NGN',
    payment_options: `card,mobilemoney,ussd`,
    amount: process.env.REACT_APP_PAYMENT_FEE,
    customer: {
      email: _.get(parkAdmin, 'email', null),
      phone_number: _.get(parkDetails, 'park_contact', null),
      name: _.get(parkDetails, 'park_name', null)
    },
    customizations: {
      title: 'Mile9ine Subscription',
      description: `Payment for Mile9ine Subscription fee!`,
      logo: 'https://mile9ine.netlify.app/images/logo.png'
    }
  }

  const handlePayment = useFlutterwave(flutterwaveConfig);

  return (
    <Fragment>
      <div className="pay">
        <div className="pay__media">
          <img src="/images/pay.png" alt="pay" />
        </div>

        <h4 className="heading">Fund Your Park Wallet to Continue...</h4>
        <h5 className="subheading">You'll pay a sum of <div className="badge badge-danger font-w700">{moneyFormat.to(50000)}</div> to use Mile9ine Services.</h5>
        
        { isLoading
          ? <div className="text-muted">Paying...</div>
          : <button onClick={() => {
            handlePayment({
              callback: async (response) => {
                console.log(response);
                postRequest(`/park_admin/verify_payment`, transformToFormData({
                  transaction_id: response?.transaction_id,
                  tx_ref: response?.tx_ref,
                  amount: process.env.REACT_APP_PAYMENT_FEE
                }), {
                  headers: { authorization: `Bearer ${await getToken()}` }
                }).then((res) => {
                    console.log('Mile Res:', res);
                    if (res.data.data === 'success') {
                      toast.success(`Wallet Funded Successfully, MILE9INE awaits you! 👋`);
                      setTimeout(() => {
                        window.location.reload(history.push('/park/admin/signin'));
                      }, 2000);
                    }
                }).catch(err => {
                  catchAxiosErrors(err, setIsLoading, null);
                }) 
              }
            })
          }} className="btn btn-primary btn-lg px-5 py-3">
              <RiSecurePaymentFill className="mr-3" size={25} />
              Pay Now
            </button>
        }
      </div>
    </Fragment>
  );
}

export default ParkMakePayment;
