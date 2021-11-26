import { Fragment } from 'react';
import { GiMoneyStack } from 'react-icons/gi';
import { useFlutterwave, closePaymentModal  } from 'flutterwave-react-v3';
import { withPark, withParkAdmin, parkAdminAtom } from '../../recoil/parkAdmin';
import { useRecoilValue, useRecoilState } from 'recoil';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { catchAxiosErrors, transformToFormData, getToken } from '../../utils';
import { postRequest } from '../../utils/axiosClient';
import './FundParkWallet.css';

const FundParkWallet = () => {

  const parkDetails = useRecoilValue(withPark);
  const adminDetails = useRecoilValue(withParkAdmin);
  const [parkAdmin, setParkAdmin] = useRecoilState(parkAdminAtom);

  const flutterwaveConfig = {
    public_key: process.env.REACT_APP_WAVE_PUB_KEY,
    tx_ref: Date.now(),
    currency: 'NGN',
    payment_options: `card,mobilemoney,ussd`,
    customer: {
      email: get(adminDetails, 'email', null),
      phone_number: '09027661950',
      // phonenumber: get(parkDetails, 'park_contact', null),
      name: get(parkDetails, 'park_name', null)
    },
    customizations: {
      title: 'Fund Park Wallet',
      description: `Funding ${get(parkDetails, 'park_name', null)}'s Wallet`,
      logo: 'https://mile9ine.netlify.app/images/logo.png'
    }
  }

  const handleFundWallet = useFlutterwave(flutterwaveConfig);

  return (
    <Fragment>
      <span onClick={() => {
        handleFundWallet({
          callback: async (response) => {
            console.log(response);
            postRequest(`/park_admin/fund_wallet`, transformToFormData({
              transaction_id: response?.transaction_id,
              tx_ref: response?.tx_ref,
              amount: response?.amount,
            }), {
              headers: { authorization: `Bearer ${await getToken()}`}
            }).then((res) => {
              console.log('Mile9ine Res:', res)
              setParkAdmin(res?.data?.park_admin);
              toast.success(`${get(parkDetails, 'park_name', null)}'s wallet funded successfully!`);
              closePaymentModal();
            }).catch(err => {
              catchAxiosErrors(err, null, null)
              closePaymentModal();
            });
          },
        })
      }} className="add-menu-sidebar" id="fund_park_wallet">
        <GiMoneyStack size={23} className="mr-2" />
        Fund Wallet
      </span>
    </Fragment>
  );
}

export default FundParkWallet;
