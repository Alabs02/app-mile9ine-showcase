import { Fragment, useState, useEffect } from 'react';
import { IoWallet } from 'react-icons/io5';
import { catchAxiosErrors, getToken } from '../../../utils';
import PropTypes from 'prop-types';
import { useRecoilState } from 'recoil';
import { parkAdminAtom } from '../../../recoil/parkAdmin';
import { getRequest } from '../../../utils/axiosClient';
import { SkeletonBlock } from 'skeleton-elements/react';
import { superAdminAtom} from '../../../recoil/Super/superAdmin';
import { parkAgentAtom } from '../../../recoil/ParkAgent';
import { parkUserAtom } from '../../../recoil/parkUser';
import _ from 'lodash';
import './WalletUpdater.css';
import "skeleton-elements/skeleton-elements.css";
import 'animate.css';

const WalletUpdater = ({ balance='0.0', endpoint, type, isRender }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [parkAdmin, setParkAdmin] = useRecoilState(parkAdminAtom);
  const [superAdmin, setSuperAdmin] = useRecoilState(superAdminAtom);
  const [parkAgent, setParkAgent] = useRecoilState(parkAgentAtom);
  const [parkUser, setParkUser] = useRecoilState(parkUserAtom);

  const update = async () => {
    try {
      setIsLoading(true);
      const { data } = await getRequest(endpoint, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });
      if (data) {
        (type === "park_admin") && setParkAdmin(data?.park_admin);
        (type === "super_admin") && setSuperAdmin(data?.user);
        (type === "park_agent") && setParkAgent(data?.user);
        (type === "user") && setParkUser(data?.user);
        setIsLoading(false);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading, null);
    }
  }

  useEffect(() => {
    update();
  } , []);

  return (
    <Fragment>
      {
        (isRender === "header") && 
        <li onClick={update} className="nav-item pointer top-wallet__balance animate__animated animate__fadeIn" title="Wallet Balance">
          <div className="d-flex">
            <IoWallet size={25} className="text-muted mr-2" />
            <div className="m-0 d-flex align-items-center">
              <span className="text-muted balance font-w500">Balance:</span>
              {isLoading && <SkeletonBlock width='6rem' height='1.5rem' effect='wave' borderRadius="4px" className="ml-2 animate__animated animate__fadeIn" />}
              {!isLoading && <span className="ml-2 text-muted balance font-w500 animate__animated animate__fadeIn">₦{balance}</span>}
            </div>
          </div>
        </li>
      }

      {(isRender === "sidebar") && 
        <div onClick={update} className="wallet__balance pointer animate__animated animate__fadeIn">
          <div className="d-flex">
            <IoWallet size={24} className="text-muted mr-2" />
            <div className="m-0 d-flex align-items-center">
              <span className="text-muted balance font-w500">Balance:</span>
              {isLoading && <SkeletonBlock width='6rem' height='1.5rem' effect='wave' borderRadius="4px" className="ml-2 animate__animated animate__fadeIn" />}
              {!isLoading && <span className="ml-2 text-muted balance font-w500 animate__animated animate__fadeIn">₦{balance}</span>}
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
}

WalletUpdater.prototype = {
  balance: PropTypes.string,
  endpoint: PropTypes.string,
  type: PropTypes.string,
  isRender: PropTypes.string,
}

export default WalletUpdater;
