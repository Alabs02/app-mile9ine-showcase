import { createRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useRecoilValue } from 'recoil';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import _ from 'lodash';
import { withEmailAuth, withParkSlug, withActivePlan } from '../recoil/parkAdmin';
import localForage from '../services/localforage';
import { getToken } from '../utils';
import { toast } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import Loader from '../Loader';
import LoadScripts from '../Hooks/loadScripts';
import './App.css';
import 'animate.css';

// Layouts
const AppLayout = lazy(() => import(/* webpackChunkName: "Layout" */ '../Layouts/AppLayout'));
const AuthLayout = lazy(() => import(/* webpackChunkName: "Layout" */ '../Layouts/AuthLayout'));
const AgentLayout = lazy(() => import(/* webpackChunkName: "Layout" */ '../Layouts/AgentLayout'));
const UserLayout = lazy(() => import(/* webpackChunkName: "Layout" */ '../Layouts/UserLayout'));
const AdminLayout = lazy(() => import(/* webpackChunkName: "Layout" */ '../Layouts/AdminLayout'));

// Components
const ErrorPage = lazy(() => import(/* webpackChunkName: "Error.404" */ '../ErrorPage'));
const Home = lazy(() => import(/* webpackChunkName: "Home" */ '../Home'));

// const SignUp = lazy(() => import(/* webpackChunkName: "Auth.User" */ '../SignUp'));
// const SignIn = lazy(() => import(/* webpackChunkName: "Auth.User" */ '../SignIn'));

// Super Admin
const SuperAdminSignin  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminSignIn'));
const SuperAdminDashboard  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminDashboard'));
const SuperAdminParks  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminParks'));
const SuperAdminProfile  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminProfile'));
const SuperAdminReferers  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminReferers'));
const SuperAdminManageParks  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminManageParks'));
const SuperAdminSettings  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminBankDetails'));
const SuperAdminRetryPayout  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminRetryPayout'));
const SuperAdminForgotPassword  = lazy(() => import(/* webpackChuckName: "Super.Admin.Auth" */ '../SuperAdmin/SuperAdminForgotPassword'));

// Park Admin
const CreatePark = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../Park/CreatePark'));
// const ParkAdminOTP  = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../Park/ParkAdminOTP'));
const ParkAdminForgotPassword  = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../Park/ParkAdminForgotPassword'));
const parkAdminSignIn = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../Park/ParkAdminSignIn'));
const ParkAdminVerify = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../VerifyEmail'));
const ParkAdminEmailVerified = lazy(() => import(/* webpackChunkName: "Park.Admin.Auth" */ '../EmailVerified'));

const ParkAdminDashboard  = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkAdminDashboard'));
const ParkBuses = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkBuses'));
const ParkBusesList = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkBusesList'));
const ParkDrivers  = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkDrivers'));
const ParkDriversList = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkDriversList'));
const ParkRides = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkRides'));
const ParkRidesList = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkRidesList'));
const AssignRideBuses = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/AssignRideBuses'));
const ParkStaff = lazy(() => import(/* webpackChunkName: "Park.Admin.Staff" */ '../Park/ParkStaff'));
const ParkStaffList  = lazy(() => import(/* webpackChunkName: "Park.Admin.Staff" */ '../Park/ParkStaffList'));
const ParkManifest = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkManifest'));
const ParkInbox = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkInbox'))
const ParkAdminProfile = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkAdminProfile')); 
const ParkMakePayment = lazy(() => import(/* webpackChunkName: "Park.Admin.Pages" */ '../Park/ParkMakePayment')); 

// Park Agent
const AgentSignIn = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentSignIn'));
const AgentDashboard = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentDashboard'));
const AgentProfile = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentProfile'));
const AgentBooking = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentBooking'));
const AgentBookRide = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentBookRide'));
const AgentTransactions = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentTransactions'));
const AgentForgotPassword = lazy(() => import(/* webpackChunkName: "Park.Agent" */ '../Agent/AgentForgotPassword'));

// User
const UserSignIn = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserSignIn'));
const UserSignUp = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserSignUp'));
const UserDashboard = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserDashboard'));
const UserBeneficiaries = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserBeneficiaries'));
const UserManageBeneficiaries = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserManageBeneficiaries'));
const UserProfile = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserProfile'));
const UserViewBooking = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserViewBooking'));
const UserBankDetails = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserBankDetails'));
const UserPayouts = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserPayouts'));
const UserForgotPassword = lazy(() => import(/* webpackChunkName: "Park.User" */ '../User/UserForgotPassword'));

const appRef = createRef();
const authRef = createRef();

const AppRoute = ({component:Component, layout:Layout, ...properties}) => (
  <GuardedRoute {...properties} render={props => (
    <Layout ref={appRef}>
      <Component {...props}></Component>
    </Layout>
  )}></GuardedRoute>
);

const AuthRoute = ({component:Component, layout:Layout, ...properties}) => (
  <Route {...properties} render={props => (
    <Layout ref={authRef}>
      <Component {...props}></Component>
    </Layout>
  )}>
  </Route>
);

const App = () => {
  // Email Verification
  const emailVerification = useRecoilValue(withEmailAuth);
  const paymentStats  = useRecoilValue(withActivePlan);
  const parkName = useRecoilValue(withParkSlug);
  console.log(`API TOKEN: `, getToken());
  console.log(`SLUG: `, parkName);
  console.log('Test form state:', emailVerification?.email_verified_at);
  console.log('Pay Stats:', paymentStats);


  const isEmailVerified = () => (emailVerification?.email_verified_at === null) ? false : true;

  const requireParkLogin = async (to, from, next) => {
    try {
      const useCredentials = await localForage.getItem('credentials');
      if (to.meta.parkAuth) {
        if (
          !_.isEmpty(useCredentials) 
          && (useCredentials?.token !== (undefined || null)) 
          && (useCredentials?.isLoggedIn !== (undefined || null))
          && (useCredentials?.type === "park_admin")
          && (useCredentials.isLoggedIn === true)
        ) {
          next();
        } else {
          next.redirect('/park/admin/signin');
        }
      } else {
        next();
      }
    } catch (err) {
      console.debug(err);
    }
  }

  const requireAgentLogin = async (to, from, next) => {
    try {
      const useCredentials = await localForage.getItem('credentials');
      if (to.meta.agentAuth) {
        if (
          !_.isEmpty(useCredentials) 
          && (useCredentials?.token !== (undefined || null)) 
          && (useCredentials?.isLoggedIn !== (undefined || null))
          && (useCredentials?.type === "agent")
          && (useCredentials.isLoggedIn === true)
        ) {
          next();
        } else {
          next.redirect('/park/staff/signin');
        }
      } else {
        next();
      }
    } catch (err) {
      console.debug(err);
    }
  }

  const requireUserLogin = async (to, from, next) => {
    try {
      const useCredentials = await localForage.getItem('credentials');
      if (to.meta.userAuth) {
        if (
          !_.isEmpty(useCredentials) 
          && (useCredentials?.token !== (undefined || null)) 
          && (useCredentials?.isLoggedIn !== (undefined || null))
          && (useCredentials?.type === "park_user")
          && (useCredentials.isLoggedIn === true)
        ) {
          next();
        } else {
          next.redirect('/park/user/signin');
        }
      } else {
        next();
      }
    } catch (err) {
      console.debug(err);
    }
  }

  const requireSuperAdminLogin = async (to, from, next) => {
    try {
      const useCredentials = await localForage.getItem('credentials');
      if (to.meta.superAuth) {
        if (
          !_.isEmpty(useCredentials) 
          && (useCredentials?.token !== (undefined || null)) 
          && (useCredentials?.isLoggedIn !== (undefined || null))
          && (useCredentials?.type === "super_admin")
          && (useCredentials.isLoggedIn === true)
        ) {
          next();
        } else {
          next.redirect('/super/admin/signin');
        }
      } else {
        next();
      }
    } catch (err) {
      console.debug(err);
    }
  }

  const requireEmailVerification = (to, from, next) => {
    if (to.meta.isEmailAuth) {
      if (isEmailVerified()) {
        next();
      } else {
        next.redirect('/park/admin/verify-email');
      }
    } else {
      next();
    }
  }
  const requireParkPayment = (to, from, next) => {
    if (to.meta.hasPayed) {
      if (paymentStats.park_payed) {
        next();
      } else {
        next.redirect('/park/admin/make-payment');
        toast.warning('This Park has not payed!');
      }
    } else {
      next();
    }
  }

  LoadScripts("/vendor/global/global.min.js");
  LoadScripts("/vendor/bootstrap-select/dist/js/bootstrap-select.min.js");
  LoadScripts("/vendor/chart.js/Chart.bundle.min.js");
  LoadScripts("/js/custom.min.js");
  LoadScripts("/js/deznav-init.js");
  LoadScripts("/vendor/peity/jquery.peity.min.js");
  LoadScripts("/js/dashboard/dashboard-1.js");

  return (
    <Router>
      <HelmetProvider>
        <GuardProvider guards={[requireParkLogin, requireEmailVerification, requireAgentLogin, requireUserLogin, requireSuperAdminLogin, requireParkPayment]} error={ErrorPage}>
          <TransitionGroup>
            <CSSTransition classNames="animate__animated animate__fadeInLeft" timeout={100}>
              <Suspense fallback={<Loader />}>
                <Switch>
                  <GuardedRoute path="/" exact component={Home}></GuardedRoute>

                  {/* Super Admin */}
                  <AppRoute path="/super/admin/dashboard" exact layout={AdminLayout} component={SuperAdminDashboard} meta={{ superAuth: true }}></AppRoute>
                  <AppRoute path="/super/admin/:adminNameSlug/parks" exact layout={AdminLayout} component={SuperAdminParks} meta={{ superAuth: true }}></AppRoute>
                  <AppRoute path="/super/admin/:adminNameSlug/profile" exact layout={AdminLayout} component={SuperAdminProfile} meta={{ superAuth: true }}></AppRoute>
                  <AppRoute path="/super/admin/:adminNameSlug/referers" exact layout={AdminLayout} component={SuperAdminReferers} meta={{ superAuth: true }}></AppRoute>
                  <AppRoute path="/super/admin/:adminNameSlug/manage/parks" exact layout={AdminLayout} component={SuperAdminManageParks} meta={{ superAuth: true }}></AppRoute>
                  <AppRoute path="/super/admin/:adminNameSlug/bank-details" exact layout={AdminLayout} component={SuperAdminSettings} meta={{ superAuth: true }}></AppRoute>
                  <AppRoute path="/super/admin/:adminNameSlug/retry-payout" exact layout={AdminLayout} component={SuperAdminRetryPayout} meta={{ superAuth: true }}></AppRoute>
                  
                  {/* Park Admin */}
                  <AppRoute path="/park/admin/dashboard" exact layout={AppLayout} component={ParkAdminDashboard} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parkNameSlug/buses" exact layout={AppLayout} component={ParkBuses} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parkNameSlug/manage/buses" exact layout={AppLayout} component={ParkBusesList} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parkNameSlug/drivers" exact layout={AppLayout} component={ParkDrivers} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parkNameSlug/manage/drivers" exact layout={AppLayout} component={ParkDriversList} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parkNameSlug/schedules" exact layout={AppLayout} component={ParkRides} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parkNameSlug/manage/schedules" exact layout={AppLayout} component={ParkRidesList} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parkNameSlug/assign-schedules" exact layout={AppLayout} component={AssignRideBuses} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parknameSlug/staff" exact layout={AppLayout} component={ParkStaff} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parknameSlug/manage/staff" exact layout={AppLayout} component={ParkStaffList} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parknameSlug/manifest" exact layout={AppLayout} component={ParkManifest} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/:parknameSlug/inbox" exact layout={AppLayout} component={ParkInbox} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  <AppRoute path="/park/admin/profile-:adminName" exact layout={AppLayout} component={ParkAdminProfile} meta={{ parkAuth: true, isEmailAuth: true, hasPayed: true }}></AppRoute>
                  
                  {/* Park Staff */}
                  <AppRoute path="/park/staff/dashboard" exact layout={AgentLayout} component={AgentDashboard} meta={{ agentAuth: true }}></AppRoute>
                  <AppRoute path="/park/staff/profile-:agentSlug" exact layout={AgentLayout} component={AgentProfile} meta={{ agentAuth: true }}></AppRoute>
                  <AppRoute path="/park/staff/verify/booking-code" exact layout={AgentLayout} component={AgentBooking} meta={{ agentAuth: true }}></AppRoute>
                  <AppRoute path="/park/staff/book-customers" exact layout={AgentLayout} component={AgentBookRide} meta={{ agentAuth: true }}></AppRoute>
                  <AppRoute path="/park/staff/transaction-history" exact layout={AgentLayout} component={AgentTransactions} meta={{ agentAuth: true }}></AppRoute>
                  

                  {/* Park User */}
                  <AppRoute path="/park/:userName/dashboard" exact layout={UserLayout} component={UserDashboard} meta={{ userAuth: true }}></AppRoute>
                  <AppRoute path="/park/:userName/beneficiaries" exact layout={UserLayout} component={UserBeneficiaries} meta={{ userAuth: true }}></AppRoute>
                  <AppRoute path="/park/:userName/manage/beneficiaries" exact layout={UserLayout} component={UserManageBeneficiaries} meta={{ userAuth: true }}></AppRoute>
                  <AppRoute path="/park/:userName/profile" exact layout={UserLayout} component={UserProfile} meta={{ userAuth: true }}></AppRoute>
                  <AppRoute path="/park/:userName/booked-rides" exact layout={UserLayout} component={UserViewBooking} meta={{ userAuth: true }}></AppRoute>
                  <AppRoute path="/park/:userName/bank-details" exact layout={UserLayout} component={UserBankDetails} meta={{ userAuth: true }}></AppRoute>
                  <AppRoute path="/park/:userName/payouts" exact layout={UserLayout} component={UserPayouts} meta={{ userAuth: true }}></AppRoute>
                  
                  {/* Super Admin */}
                  <AuthRoute path="/super/admin/signin" exact layout={AuthLayout} component={SuperAdminSignin}></AuthRoute>
                  <AuthRoute path="/super/admin/forgot-password" exact layout={AuthLayout} component={SuperAdminForgotPassword} meta={{ superAuth: false,  }}></AuthRoute>

                  {/* Park Admin Auth */}
                  <AuthRoute path="/park/admin/signin" exact layout={AuthLayout} component={parkAdminSignIn}></AuthRoute>
                  {/*<AuthRoute path="/park/admin/signin-otp" exact layout={AuthLayout} component={ParkAdminOTP} meta={{ parkAuth: true }}></AuthRoute>*/}
                  <AuthRoute path="/park/admin/forgot-password" layout={AuthLayout} component={ParkAdminForgotPassword}></AuthRoute>


                  {/* Park Staff Auth */}
                  <AuthRoute path="/park/staff/signin" layout={AuthLayout} exact component={AgentSignIn}></AuthRoute>
                  <AuthRoute path="/park/staff/forgot-password" layout={AuthLayout} exact component={AgentForgotPassword}></AuthRoute>

                  
                  {/* Park User */}
                  <AuthRoute path="/park/user/signup" layout={AuthLayout} exact component={UserSignUp}></AuthRoute>
                  <AuthRoute path="/park/user/signin" layout={AuthLayout} exact component={UserSignIn}></AuthRoute>
                  <AuthRoute path="/park/user/forgot-password" layout={AuthLayout} exact component={UserForgotPassword}></AuthRoute>

                  <GuardedRoute path="/register/park/:userRef?" exact component={CreatePark}></GuardedRoute>
                  <GuardedRoute path="/park/admin/verify-email" exact component={ParkAdminVerify} meta={{ parkAuth: true }}></GuardedRoute>
                  <GuardedRoute path="/park/admin/email-verified" exact component={ParkAdminEmailVerified} meta={{ parkAuth: true }}></GuardedRoute>
                  <GuardedRoute path="/park/admin/make-payment" exact component={ParkMakePayment} meta={{ parkAuth: true }}></GuardedRoute>
                  <GuardedRoute path="*" exact component={ErrorPage}></GuardedRoute>
                </Switch>
              </Suspense>
            </CSSTransition>
          </TransitionGroup>
        </GuardProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;