import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';
import { withParksCountQuery } from '../../../recoil/Super/superGetParksCount';

const ParksCount = () => {

  const parksCount = useRecoilValue(withParksCountQuery);

  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-12 col-md-3">
          <h6 className="m-0 overline text-uppercase">Number of Parks</h6>
          <div className="card">
            <div className="card-body text-center d-flex justify-content-center w-100">
              <h1 className="m-0 text-success"  style={{
                fontSize: '3rem',
              }}>{parksCount}</h1>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ParksCount;
