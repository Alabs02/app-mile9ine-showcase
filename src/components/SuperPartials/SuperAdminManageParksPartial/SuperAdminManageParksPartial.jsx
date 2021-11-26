import { Fragment, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { withSuperAdminParksQuery, superAdminParksAtom } from '../../../recoil/Super/superAdminParks';
import _, { isEmpty } from 'lodash';
import { catchAxiosErrors, getToken } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import './SuperAdminManageParksPartial.css';

const SuperAdminManageParksPartial = () => {

  const parksArray = useRecoilValue(withSuperAdminParksQuery);
  const [parks, setParks] = useRecoilState(superAdminParksAtom);
  const [query, setQuery] = useState("");
  console.log('Park Array', parksArray);
  const filteredParks = parksArray.filter(park => {
    return park.park_name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  });
  console.log('Filtered:', filteredParks);

  const removeElements = (pId) => {
    setParks(filteredParks.filter(item => item.id !== pId));
  } 

  const handleLoadingState = (elementName, pId) => {
    const element = document.getElementById(`${elementName}${pId}`);
    const loader = document.getElementById(`delete_msg${pId}`);

    if (element.classList.contains("hidden")) {
      loader.classList.add("hidden");
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
      loader.classList.remove("hidden");
    }
  }

  const deletePark = async (elementName, pId) => {
    try {
      handleLoadingState(elementName, pId);
      const { data } = await postRequest(`/super_admin/delete-park/${pId}`, null, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data);
        // removeElements(pId);
        setParks({});
        toast.success(`Deleted Successfully!`);
      }
    } catch (err) {
      handleLoadingState(elementName, pId);
      catchAxiosErrors(err, null, null);
    }
  }

  const revokePark = async (pId) => {
    try {
      const { data } = await postRequest(`/super_admin/revoke-park/${pId}`, null, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data);
        setParks({});
        toast.success(`${_.get(data, 'message', null)}`);
      }
    } catch (err) {
      catchAxiosErrors(err, null, null);
    }
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <input type="search" onChange={e => setQuery(e.target.value)} placeholder="Search for parks" className="form-control" />
            </div>
          </div>  
        </div>
      </div>

      <div className="row">
        {(!isEmpty(filteredParks))
          ? filteredParks.map((park) => (
            <div key={_.get(park, 'id', null)} className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12 col-md-4">
                      <h6 className="m-0">Park Name</h6>
                      <p className="m-0 mb-2">{_.get(park, 'park_name', null)}</p>

                      
                      <h6 className="m-0">Park Address</h6>
                      <p className="m-0">{_.get(park, 'park_address', null)}</p>
                    </div>

                    <div className="col-sm-12 col-md-3">
                      <h6 className="m-0">Park Contact</h6>
                      <p className="m-0 mb-2">{_.get(park, 'park_contact', null)}</p>

                      <h6 className="m-0">Park City</h6>
                      <p className="m-0">
                        {`${_.get(park, 'park_city', null)}, ${_.get(park, 'park_state', null)}`}
                      </p>
                    </div>

                    <div className="col-sm-12 col-md-3">
                      <h6 className="m-0">Park Wallet</h6>
                      <p className="m-0 mb-2 badge badge-danger">₦{_.get(park, 'park_wallet_amount')}</p>

                      <h6 className="m-0">Park Zip</h6>
                      <p className="m-0">{_.get(park, 'park_zip', null)}</p>
                    </div>

                    <div className="col-sm-12 col-md-2 d-flex flex-column justify-content-between">
                      <button onClick={() => revokePark(_.get(park, 'id', null))} id={`revoke_btn${_.get(park, 'id', null)}`} className="btn bg-dark-yellow mb-2">
                        {(_.get(park, 'is_revoked', null))
                          ? 'Unrevoke Park'
                          : 'Revoke Park'
                        }
                      </button>
                     
                      <div id={`delete_msg${_.get(park, 'id', null)}`} className="text-muted hidden">Deleting...</div>
                      <button onClick={() => deletePark('delete_btn' ,_.get(park, 'id', null))} id={`delete_btn${_.get(park, 'id', null)}`} className="btn btn-primary">Delete Park</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
          : <div className="col-sm-12 text-center">
              <p>No Parks At This Time!</p>
            </div>
        }
      </div>
    </Fragment>
  );
}

export default SuperAdminManageParksPartial;
