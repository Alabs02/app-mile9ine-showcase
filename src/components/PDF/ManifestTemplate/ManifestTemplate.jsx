import { Fragment, } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './ManifestTemplate.css';

const ManisfestTemplate = ({ manifestArray, details, parkName }) => {
  return (
    <Fragment>
      <div id="manifest__pdf--wrapper">
        <div id="manifest-pdf" className="w-100 h-100 position-relative px-5 py-5 border-light bg-white rounded border-2">

          <div className="d-flex flex-column justify-content-center align-items-center mb-3">
            <h1 className="text-uppercase letter__wide">{parkName && parkName}</h1>
            <h4>Passenger Manifest Form</h4>
          </div>

          <div className="row my-4 d-flex justify-content-between align-items-center">
            <div>
              <h4>Date (From) : {new Date(_.get(details, 'from', new Date())).toDateString()}</h4>
              <h4>Route : {`${_.get(details, 'starting_point', null)} - ${_.get(details, 'destination', null)}`}</h4>
            </div>
            <div>
              <h4>Date (To): {new Date(_.get(details, 'to', new Date())).toDateString()}</h4>
              <h4>Bus Plate Number: {_.get(details, 'busNumber', null)}</h4>
            </div>
          </div>

          <div className="row overflow-auto mb-5">
            <div className="col-xl-12 overflow-auto">
              <div className="table-responsive overflow-auto">
                <table className="table table-sm card-table display dataTablesCard rounded-xl overflow-hidden table__border shadow-sm">
                  <thead className="bg-light">
                    <tr>
                      <th><strong className="text-muted">S/N</strong></th>
                      <th><strong className="text-muted">Name</strong></th>
                      <th><strong className="text-muted">Contact</strong></th>
                      <th><strong className="text-muted">Address</strong></th>
                      <th><strong className="text-muted">Next of Kin's Name</strong></th>
                      <th><strong className="text-muted">Next of Kin's Contact</strong></th>
                      <th><strong className="text-muted">Next of Kin's Address</strong></th>
                    </tr>
                  </thead>
                  <tbody>
                    { manifestArray &&
                      manifestArray.map((manifest, index) => (
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{_.get(manifest, 'user.name', null)}</td>
                          <td>{_.get(manifest, 'user.user_profile.contact', null)}</td>
                          <td>{_.get(manifest, 'user.user_profile.address', null)}</td>
                          <td>{_.get(manifest, 'user.user_profile.next_kin_name', null)}</td>
                          <td>{_.get(manifest, 'user.user_profile.next_kin_contact', null)}</td>
                          <td>{_.get(manifest, 'user.user_profile.next_kin_address', null)}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="table__footer">
              <div>
                <div className="mb-2">
                    <h6>Total Number of People on Bus at <br /> <b>START</b> of trip:</h6>
                    <div className="badge badge-danger badge-circle">{manifestArray && manifestArray.length}</div>
                </div>

                <div>
                    <h6>Total number of People on Bus for <br /> <b>RETURN</b> of trip:</h6>
                    <div className="badge badge-danger badge-circle">{manifestArray && manifestArray.length}</div>
                </div>
              </div>

              <div className="table__actions">
                  <p className="m-0 mr-2 text-danger">Powered by </p>
                  <div className="table__media"
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  >
                    <img src="/images/logo.png" className="" style={{ objectFit: 'contain' }} alt="logo" />
                  </div>
              </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

ManisfestTemplate.propTypes = {
  manifestArray: PropTypes.array, 
  details: PropTypes.object, 
  parkName: PropTypes.string,
}

export default ManisfestTemplate;
