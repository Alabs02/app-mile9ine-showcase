import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { IoWallet } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import _ from 'lodash';
import { logoutEntity } from '../../../services';
import { slugify } from '../../../utils';
import { withUser, withUserProfile, withWalletBalance } from '../../../recoil/parkUser';
import { toast, cssTransition } from 'react-toastify';
import { checkGender } from '../../../utils';
import WalletUpdater from '../WalletUpdater/WalletUpdater';
import './UserMiniHeader.css';

const UserMiniHeader = () => {

  const history = useHistory();
  const userProfile = useRecoilValue(withUserProfile);
  const userDetails = useRecoilValue(withUser);
  const userWallet = useRecoilValue(withWalletBalance);
  const [prompt, setPrompt]= useState(false);

  const flip = cssTransition({
    enter: "animate__animated animate__flipInX",
    exit: "animate__animated animate__flipOutX"
  });

  const promptAlert = () => {
    toast.error(<Message />, {
      position: 'top-center',
      autoClose: false,
      hideProgressBar: true,
      theme: 'colored',
      closeOnClick: false,
      transition: flip,
    });
  }

  useEffect(() => {
    _.forIn(userProfile, (val, key) => {
      if(val === null) {
        setPrompt(true);
      }
    });

    if (prompt) {
      promptAlert();
    }
  }, [prompt])

  console.log('User Profile:', userProfile);

  return (
    <Fragment>
      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="dashboard_bar">
                  Dashboard
                </div>
              </div>

              <ul className="navbar-nav header-right">
                <WalletUpdater 
                  balance={_.get(userWallet, 'user_wallet', '0.00')}
                  endpoint={`/park_user/get-user`}
                  type={`user`}
                  isRender={`header`}
                />

                <li className="nav-item dropdown notification_dropdown">
                  <a className="nav-link ai-icon" href="/" role="button" data-toggle="dropdown">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.8333 5.91732V3.49998C12.8333 2.85598 13.356 2.33331 14 2.33331C14.6428 2.33331 15.1667 2.85598 15.1667 3.49998V5.91732C16.9003 6.16698 18.5208 6.97198 19.7738 8.22498C21.3057 9.75681 22.1667 11.8346 22.1667 14V18.3913L23.1105 20.279C23.562 21.1831 23.5142 22.2565 22.9822 23.1163C22.4513 23.9761 21.5122 24.5 20.5018 24.5H15.1667C15.1667 25.144 14.6428 25.6666 14 25.6666C13.356 25.6666 12.8333 25.144 12.8333 24.5H7.49817C6.48667 24.5 5.54752 23.9761 5.01669 23.1163C4.48469 22.2565 4.43684 21.1831 4.88951 20.279L5.83333 18.3913V14C5.83333 11.8346 6.69319 9.75681 8.22502 8.22498C9.47919 6.97198 11.0985 6.16698 12.8333 5.91732ZM14 8.16664C12.4518 8.16664 10.969 8.78148 9.87469 9.87581C8.78035 10.969 8.16666 12.453 8.16666 14V18.6666C8.16666 18.8475 8.12351 19.026 8.04301 19.1881C8.04301 19.1881 7.52384 20.2265 6.9755 21.322C6.88567 21.5028 6.89501 21.7186 7.00117 21.8901C7.10734 22.0616 7.29517 22.1666 7.49817 22.1666H20.5018C20.7037 22.1666 20.8915 22.0616 20.9977 21.8901C21.1038 21.7186 21.1132 21.5028 21.0234 21.322C20.475 20.2265 19.9558 19.1881 19.9558 19.1881C19.8753 19.026 19.8333 18.8475 19.8333 18.6666V14C19.8333 12.453 19.2185 10.969 18.1242 9.87581C17.0298 8.78148 15.547 8.16664 14 8.16664Z" fill="#FE634E"/>
                    </svg>
                    <div className="pulse-css"></div>
                  </a>
                  <div className="rounded dropdown-menu dropdown-menu-right">
                    <div id="DZ_W_Notification1" className="p-3 widget-media dz-scroll height380">
                      <div className="text-muted text-center">Empty Notification!</div>
                        {/*<ul className="timeline">
                          <li>
                            <div className="timeline-panel">
                              <div className="mr-2 media">
                                DR
                              </div>
                              <div className="media-body">
                                <h6 className="mb-1">Dr sultads Send you Photo</h6>
                                <small className="d-block">29 July 2020 - 02:26 PM</small>
                              </div>
                            </div>
                          </li>
                        </ul>*/}
                    </div>
                    {/*<span className="all-notification">See all notifications <i className="ti-arrow-right"></i></span>*/}
                  </div>
                </li>

                <li className="nav-item dropdown header-profile">
                  <a className="nav-link" href="/" role="button" data-toggle="dropdown">
                    <div className="avatar">
                      <img src={checkGender(_.get(userProfile, 'gender', null))} alt="avatar" />
                    </div>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <Link to={`/park/${slugify(_.get(userDetails, 'name', null))}/profile`} className="dropdown-item ai-icon">
                      <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span className="ml-2">Profile </span>
                    </Link>
                    
                    <button onClick={() => logoutEntity(`/park_user/logout`, history)} className="dropdown-item ai-icon">
                      <svg id="icon-logout" xmlns="http://www.w3.org/2000/svg" className="text-danger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      <span className="ml-2">Logout </span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </Fragment>
  );
}

export const Message = () => {

  const userDetails = useRecoilValue(withUser);
  
  const pageRoute = `/park/${slugify(_.get(userDetails, 'name', null))}/profile`;
  console.log(pageRoute );

  return (
    <Fragment>
      <p className="m-0">Hello, Please update your profile to start using mil9ine!</p>
      <div className="m-0 d-flex justify-content-between">
        <p className="m-0">Cheer 🥂</p>
        <p>-Mile9ine</p>
      </div>
      <a href={pageRoute} className="btn-sm btn btn-light">Update Profile</a>
    </Fragment>
  );
}

export default UserMiniHeader;
