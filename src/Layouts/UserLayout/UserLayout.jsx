import { Fragment, forwardRef, lazy, Suspense } from 'react';
import './UserLayout.css';

const AppBrand = lazy(() => import(/* webpackChunkName: "Core" */ '../../components/core/AppBrand'));
const MiniFooter = lazy(() => import(/* webpackChunkName: "Footer" */ '../../components/core/MiniFooter'));
const UserMiniHeader = lazy(() => import(/* webpackChunkName: "Header" */ '../../components/core/UserMiniHeader'));
const UserSideBar = lazy(() => import(/* webpackChunkName: "Core" */ '../../components/core/UserSideBar'));

const UserLayout = forwardRef(({ children }, ref) => (
  <Fragment>  
    <div ref={ref} id="main-wrapper">
      <Suspense fallback={<div>Brand...</div>}>
        <AppBrand />
      </Suspense>

      <Suspense fallback={<div>Header...</div>}>
        <UserMiniHeader />
      </Suspense>

      <Suspense fallback={<div>SideBar...</div>}>
        <UserSideBar />
      </Suspense>

      <div className="content-body">
        <div className="container-fluid">
          {children && children}
        </div>
      </div>

      <Suspense fallback={<div>Footer...</div>}>
        <MiniFooter className="footer" />
      </Suspense>
    </div>
  </Fragment>
));

export default UserLayout;
