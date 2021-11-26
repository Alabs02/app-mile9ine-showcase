import { Fragment, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { logoutEntity } from '../../../services'
import { useHistory } from 'react-router';
import { AiOutlineDashboard } from 'react-icons/ai';
import { GiPayMoney } from 'react-icons/gi';
import { FaBus } from 'react-icons/fa';
import { AiTwotoneBank } from 'react-icons/ai';
import { IoIosLogOut } from 'react-icons/io';
import { TiGroup } from 'react-icons/ti';
import { ImProfile } from 'react-icons/im';
import { slugify } from '../../../utils';
import { useRecoilValue } from 'recoil';
import { withSuperAdmin, withSuperAdminWallet } from '../../../recoil/Super/superAdmin';
import _ from 'lodash';
import WalletUpdater from '../WalletUpdater/WalletUpdater';
import './AdminSideBar.css';

const AdminSideBar = () => {

  const history = useHistory();
  const adminProfile = useRecoilValue(withSuperAdmin);
  const adminSlug = slugify(_.get(adminProfile, 'name', null));
  const adminWallet = useRecoilValue(withSuperAdminWallet);

  return (
    <Fragment>
      <div className="deznav">
        <div className="deznav-scroll">
          <WalletUpdater 
            balance={_.get(adminWallet, 'super_admin_detail.super_admin_wallet', '0.00')}
            endpoint={`/super_admin/get-superadmin`}
            type={`super_admin`}
            isRender={`sidebar`}
          />

          <span onClick={() => history.push(`/super/admin/${adminSlug}/retry-payout`)} className="add-menu-sidebar">
            <GiPayMoney size={23} className="mr-2" />
            Retry Payout
          </span>
          
          <ul className="metismenu" id="menu">
            <li>
              <Link to="/super/admin/dashboard" className="ai-icon has-flex">
                <i>
                  <AiOutlineDashboard size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to={`/super/admin/${adminSlug}/profile`} className="ai-icon has-flex">
                <i>
                  <ImProfile size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Profile</span>
              </Link>
            </li>

            <li>
              <Link to={`/super/admin/${adminSlug}/referers`} className="ai-icon has-flex">
                <i>
                  <TiGroup size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Referers</span>
              </Link>
            </li>

            <li>
              <Link to={`/super/admin/${adminSlug}/retry-payout`} className="ai-icon has-flex">
                <i>
                  <GiPayMoney size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Retry Payout</span>
              </Link>
            </li>
          
            {/*<li>
              <Link to={`/park/admin/profile-${slugify(get(adminName, 'first_name', null)+get(adminName, 'last_name', null))}`} className="ai-icon has-flex">
                <i>
                  <ImProfile size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Profile</span>
              </Link>
            </li>*/}
            
            <li>
              <a className="has-arrow ai-icon has-flex pointer">
                <i>
                  <FaBus size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Your Parks</span>
              </a>
              
              <ul>
                <li><Link to={`/super/admin/${adminSlug}/parks`}>Parks</Link></li>
                <li><Link to={`/super/admin/${adminSlug}/manage/parks`}>Manage Parks</Link></li>
              </ul>
            </li>

            <li>
              <Link to={`/super/admin/${adminSlug}/bank-details`} className="ai-icon has-flex">
                <i>
                  <AiTwotoneBank size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Bank Details</span>
              </Link>
            </li>

            <li>
              <a onClick={() => logoutEntity(`/super_admin/logout`, history)} className="ai-icon has-flex pointer">
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

export default AdminSideBar;
