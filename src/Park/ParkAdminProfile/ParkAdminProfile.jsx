import { Fragment } from 'react';
import { get } from 'lodash';
import LoadScripts from '../../Hooks/loadScripts';
import { useRecoilValue } from 'recoil';
import { withParkAdmin } from '../../recoil/parkAdmin';
import { BsFillPersonFill } from 'react-icons/bs';
import { HiOutlineMailOpen } from 'react-icons/hi';
import './ParkAdminProfile.css';

const ParkAdminProfile = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  const adminProfile = useRecoilValue(withParkAdmin);
  console.log(adminProfile);


  return (
    <Fragment>
    <div className="mt-5">
      <div className="row">
        <div className="col-sm-12 col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="card-media profile__media">
                <div className="profile__avatar">
                  <img src="/images/male.svg" alt="avatar" className="card-img profile__img" />
                </div>
              </div>

              <div className="card-copy mt-3">
                <div className="d-flex justify-content-center mb-2">
                  <BsFillPersonFill className="text-primary mr-2" size={22} />
                  <span className="text-muted">{`${_.get(adminProfile, 'first_name', null)} ${_.get(adminProfile, 'last_name', null)}`}</span>
                </div>

                <div className="d-flex justify-content-center">
                  <HiOutlineMailOpen className="text-primary mr-2" size={22} />
                  <span className="text-muted">{get(adminProfile, 'email', null)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Fragment>
  )
}

export default ParkAdminProfile;
