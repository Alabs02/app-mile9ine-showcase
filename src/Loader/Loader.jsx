import { Fragment } from 'react';
import { Circles } from 'react-loading-icons';

const Loader = () => {
  return (
    <Fragment> 
      <div
        style={{
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Circles fill="#FF4847"  width={'4rem'} height={'4rem'} />
      </div>
    </Fragment>
  );
}

export default Loader;
