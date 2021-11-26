import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineDashboard } from 'react-icons/ai';
import { IoIosLogOut } from 'react-icons/io';
import { FiList } from 'react-icons/fi';
import { ImProfile } from 'react-icons/im';
import { useRecoilValue } from 'recoil';
import { useHistory } from 'react-router';
import { withUserAgent, withAgentDetails } from '../../../recoil/ParkAgent';
import { get } from 'lodash';
import { slugify } from '../../../utils';
import { logoutEntity } from '../../../services';
import { MdEventSeat } from 'react-icons/md';
import WalletUpdater from '../WalletUpdater/WalletUpdater';
import './AgentSideBar.css';

const AgentSideBar = () => {

  const history = useHistory();
  const agentDetails = useRecoilValue(withUserAgent);
  const agentWalletDetails = useRecoilValue(withAgentDetails);
  console.log('Sidebar State:', agentDetails);

  return (
    <Fragment>
      <div className="deznav" id="agentSidebar">
        <div className="deznav-scroll">
          <WalletUpdater 
            balance={get(agentWalletDetails, 'agent_wallet_amount', '0.00')}
            endpoint={`/park_agent/get-agent`}
            type={`park_agent`}
            isRender={`sidebar`}
          />

          <span className="add-menu-sidebar">
            👋 Hello 
          </span>
          <ul className="metismenu" id="menu">
            <li>
              <Link to="/park/staff/dashboard" className="ai-icon has-flex">
                <i>
                  <AiOutlineDashboard size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
            

            <li>
              <Link to={`/park/staff/book-customers`} className="ai-icon has-flex">
                <i>
                  <MdEventSeat size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Book A Ride</span>
              </Link>
            </li>

            <li>
              <Link to={`/park/staff/transaction-history`} className="ai-icon has-flex">
                <i>
                  <FiList size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Transaction History</span>
              </Link>
            </li>

            <li>
              <Link to={`/park/staff/profile-${slugify(get(agentDetails, 'name', null))}`} className="ai-icon has-flex">
                <i>
                  <ImProfile size={"22px"} className="nav-icon" />
                </i>
                <span className="nav-text">Profile</span>
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

export default AgentSideBar;
