import { Fragment } from 'react';
import { IoWallet } from 'react-icons/io5';
import './WalletBalance.css';

const WalletBalance = ({ balance='0.00' }) => {
  return (
    <Fragment>
      <div className="wallet__balance">
        <div className="d-flex">
          <IoWallet size={25} className="text-muted mr-2" />
          <span className="text-muted balance font-w500">Balance: <span className="ml-2">₦{balance}</span></span>
        </div>
      </div>
    </Fragment>
  );
}

export default WalletBalance;
