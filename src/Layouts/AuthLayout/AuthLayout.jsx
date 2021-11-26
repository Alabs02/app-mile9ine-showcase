import { Fragment, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = forwardRef(({ children }, ref) => (
  <Fragment>
    <div>
      <div ref={ref} className="h-100 auth-layout mb-5">
        <div className="authincation h-100">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-md-6 col-sm-12">
                <div className="authincation-content bg-dark">
                  <div className="row no-gutters">
                    <div className="col-xl-12">
                      <div className="auth-form">
                        <div className="mb-3 text-center">
                          <Link to="/">
                            <img src="/images/logo-full1.png" alt="logo" />
                          </Link>
                        </div>
                        {children && children}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
));

export default AuthLayout;
