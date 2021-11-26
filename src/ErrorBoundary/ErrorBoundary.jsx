import {Component, Fragment} from 'react';
import { IoReloadCircle } from 'react-icons/io5';
import { MdSignalWifiOff } from 'react-icons/md';
import './ErrorBoundary';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
    
    console.log('Error: ', error);
    console.log('ErrorInfo: ', errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.errorInfo) {
      return (
        <Fragment>
          <div className="container h-100 w-100 d-flex flex-column justify-content-center bg-transparent">
            <div className="snackbar shadow w-100 rounded-bottom bg-light">
              <div className="snackbar__body d-flex flex-column align-items-center justify-content-center py-4">
                <h5 className="m-0 mb-2 custom err-text__size">Something Went Wrong! </h5>
                <div className="d-flex">
                  <MdSignalWifiOff className="mr-2 text-danger" size={20} />
                  <h6 className="m-0 mb-3 fs-5">Please check your internet connection!</h6>
                </div>
                <button onClick={() => window.location.reload(true)} type="button" className="btn btn-primary">
                  <IoReloadCircle size={20} className="mr-2" />
                  Reload
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;