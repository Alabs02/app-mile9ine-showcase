import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineDashboard } from 'react-icons/ai';
import { IoIosLogOut } from 'react-icons/io';
import { FaUserFriends, FaMoneyBillWave } from 'react-icons/fa';
import { MdEventSeat } from 'react-icons/md';
import { AiTwotoneBank } from 'react-icons/ai';
import { ImProfile } from 'react-icons/im';
import { useRecoilValue } from 'recoil';
import { useHistory } from 'react-router';
import { get } from 'lodash';
import { slugify } from '../../../utils';
import { logoutEntity } from '../../../services';
import { withUser, withWalletBalance } from '../../../recoil/parkUser';
import WalletUpdater from '../WalletUpdater/WalletUpdater';
import './UserSideBar.css';

const UserSideBar = () => {

  const history = useHistory();
  const userDetails = useRecoilValue(withUser);
  const userWallet = useRecoilValue(withWalletBalance);

  console.log('User Details:', userDetails)

  return (
    <Fragment>
      <div className="deznav" id="userSidebar">
        <div className="deznav-scroll">
          <WalletUpdater 
            balance={get(userWallet, 'user_wallet', '0.00')}
            endpoint={`/park_user/get-user`}
            type={`user`}
            isRender={`sidebar`}
          />
          <ul className="metismenu" id="menu">
            <li>
              <Link to={`/park/${slugify(get(userDetails, 'name', null))}/dashboard`} className="ai-icon has-flex">
                <i>
                  <AiOutlineDashboard size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>

            {/*<li>
              <Link to={`/park/admin/profile-${slugify(get(adminName, 'first_name', null)+get(adminName, 'last_name', null))}`} className="ai-icon has-flex">
                <i>
                  <ImProfile size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Profile</span>
              </Link>
            </li>
            
            <li>
              <a className="has-arrow ai-icon has-flex pointer">
                <i>
                  <BiBus size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Park Buses</span>
              </a>
              
              <ul>
                <li><Link to={`/park/${parkNameSlug}/buses`}>Buses</Link></li>
                <li><Link to={`/park/${parkNameSlug}/manage/buses`}>Manage Buses</Link></li>
              </ul>
            </li>*/}
            

            <li>
              <Link to={`/park/${slugify(_.get(userDetails, 'name', null))}/profile`} className="ai-icon has-flex">
                <i>
                  <ImProfile size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Profile</span>
              </Link>
            </li>

            <li>
              <Link to={`/park/${slugify(_.get(userDetails, 'name', null))}/bank-details`} className="ai-icon has-flex">
                <i>
                  <AiTwotoneBank size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Bank Details</span>
              </Link>
            </li>

            <li>
              <Link to={`/park/${slugify(_.get(userDetails, 'name', null))}/booked-rides`} className="ai-icon has-flex">
                <i>
                  <MdEventSeat size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">View Booking</span>
              </Link>
            </li>

            <li>
              <a className="has-arrow ai-icon has-flex pointer">
                <i>
                  <FaUserFriends size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Beneficiaries</span>
              </a>
              
              <ul>
                <li><Link to={`/park/${slugify(get(userDetails, 'name', null))}/beneficiaries`}>Beneficiaries</Link></li>
                <li><Link to={`/park/${slugify(get(userDetails, 'name', null))}/manage/beneficiaries`}>Manage Beneficiaries</Link></li>
              </ul>
            </li>

            <li>
              <Link to={`/park/${slugify(_.get(userDetails, 'name', null))}/payouts`} className="ai-icon has-flex">
                <i>
                  <FaMoneyBillWave size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Payouts</span>
              </Link>
            </li>

            <li>
              <a onClick={() => logoutEntity(`/park_user/logout`, history)} className="ai-icon has-flex pointer">
                <i>
                  <IoIosLogOut size={40} className="nav-icon" />
                </i>
                <span className="nav-text">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default UserSideBar;
