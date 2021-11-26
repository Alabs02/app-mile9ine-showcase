import { forwardRef, Fragment, lazy, Suspense } from 'react';

const AdminMiniHeader = lazy(() => import(/* webpackChunkName: "Header" */ '../../components/core/AdminMiniHeader'));
const MiniFooter = lazy(() => import(/* webpackChunkName: "Footer" */ '../../components/core/MiniFooter'));
const AppBrand = lazy(() => import(/* webpackChunkName: "Core" */ '../../components/core/AppBrand'));
const AdminSideBar = lazy(() => import(/* webpackChunkName: "Core" */ '../../components/core/AdminSideBar'));

const AdminLayout  = forwardRef(({ children }, ref) => (
  <Fragment>
    <div ref={ref} id="main-wrapper">
      <Suspense fallback={<div>Brand...</div>}>
        <AppBrand />
      </Suspense>

      <Suspense fallback={<div>Header...</div>}>
        <AdminMiniHeader />
      </Suspense>

      <Suspense fallback={<div>Sidebar...</div>}>
        <AdminSideBar />
      </Suspense>
      
      
      <div className="content-body">
        <div className="container-fluid">
          {children}
        </div>
      </div>
      
      <Suspense fallback={<div>Footer...</div>}>
        <MiniFooter className="footer" />
      </Suspense>
    </div>
  </Fragment>
));

export default AdminLayout;