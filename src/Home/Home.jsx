import { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MiniFooter from '../components/core/MiniFooter';
import LoadScripts from '../Hooks/loadScripts';
import { Helmet } from 'react-helmet-async';
import { locationRef } from '../utils';
import './Home.css';

const Home = () => {

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");  
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  useEffect(() => {
    setTimeout(() => {
      window.location.href = 'https://mile9ine.com';
    }, 1000);
  } , []);
  
  return (
    <Fragment>
      <div className="page-content w-100 h-100 d-flex justify-content-center align-items-center" id="main-wrapper">
        <div className="container-fluid grid__container">
          <h1 className="text-gray font-1 font-w800">REDIRECTING...</h1>
        </div>
      </div>
      <MiniFooter className="auth-footer" />
    </Fragment>
  );
}

export default Home;
