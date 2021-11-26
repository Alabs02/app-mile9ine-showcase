import { Fragment, useState } from 'react';
import { Formik, Form, Field, FastField } from 'formik';
import { object, string, number } from 'yup';
import { GiMoneyStack } from 'react-icons/gi';
import { CgCloseO } from 'react-icons/cg';
import { catchAxiosErrors, transformToFormData, getToken, months, moneyFormat } from '../../../utils';
import { getRequest } from '../../../utils/axiosClient';
import { useRecoilValue } from 'recoil';
import { withSuperAdminParksQuery } from '../../../recoil/Super/superAdminParks';
import _ from 'lodash';
import { TextField } from '../../FormField';
import { toast } from 'react-toastify';
import 'animate.css';

const initialFormValues = () => {
  return {
    park_id: 0,
    month: '',
    year: ''
  }
}

const schema = object().shape({
  park_id: number()
    .required('Required!'),
  month: string()
    .required('Required!'),
});

const SuperAdminParkMonthlyFunds = () => {

  const [isLoading, setIsLoading] = useState();
  const parks  = useRecoilValue(withSuperAdminParksQuery);
  const [revenue, setRevenue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  console.log(parks)

  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={initialFormValues()}
                validationSchema={schema}
                onSubmit={async (values) => {
                  try {
                    setIsLoading(true);
                    setIsVisible(false);
                    const { data, status, statusText } = await getRequest(`/super_admin/get-park-profit-per-month`, 
                      {
                        params: values,
                        headers: { authorization: `Bearer ${await getToken()}` }
                      }
                    );

                    if (data) {
                      console.log('Result', data);
                      setIsLoading(false);
                      setRevenue(data.total_amount_made_per_month);
                      setIsVisible(true);
                      toast.success(`Total amount: ${data.total_amount_made_per_month}`, {
                        autoClose: true,
                        position: 'top-center'
                      });
                    }
                  } catch (err) {
                    catchAxiosErrors(err, setIsLoading, null)
;                  }
                }}
              >
                {props => (
                  <Form>
                    <div className="row">
                      <div className="col-sm-12 col-md-3">
                        <label htmlFor="park_id" className="fs-5 m-0">Select Park*</label>
                        <FastField name="park_id">
                          {({ field }) => (
                            <select className="form-control" {...field}>
                              <option defaultValue={0}>Select</option>
                              {(_.isEmpty(parks))
                                ? <option value={0}>No Parks</option>
                                : parks.map((park) => (
                                    <option key={_.get(park, 'id', null)} value={(+_.get(park, 'id', null))}>
                                      {`${_.get(park, 'park_name', null)} | ${_.get(park, 'park_contact', null)}`}
                                    </option>
                                  ))
                              }
                            </select>
                          )}
                        </FastField>
                      </div>

                      <div className="col-sm-12 col-md-3">
                        <label htmlFor="month" className="fs-5 m-0">Select Month*</label>
                        <FastField name="month">
                          {({ field }) => (
                            <select className="form-control" {...field}>
                              <option defaultValue={0}>Select</option>
                              {(_.isEmpty(months))
                                ? <option value={0}>No Months</option>
                                : months.map((month, index) => (
                                    <option key={index} value={_.get(month, 'id', null)}>
                                      {_.get(month, 'title', null)}
                                    </option>
                                  ))
                              }
                            </select>
                          )}
                        </FastField>
                      </div>

                      <div className="col-sm-12 col-md-3">
                        <label htmlFor="year" className="fs-5 m-0">Year (optional)</label>
                        <Field name="year" type="text" as={TextField} placeholder="e.g 2022" />    
                      </div>

                      <div className="col-sm-12 col-md-3 mt-4">
                        { isLoading
                          ? <p className="m-0">Searching...</p>
                          : <button type="submit" className="btn btn-primary btn-block">Search</button>
                        }
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      { isVisible &&
        <div className="row mb-4 animate__animated animate__fadeIn">
          <h5 className="overline px-4 text-uppercase fs-13">Results</h5>
          <div className="col-xl-12">
            <div className="card position-relative">
              <div className="card-body py-3">
                <div className="row">
                  <div className="col-sm-4">
                    <GiMoneyStack className="text-primary" size={40} />
                  </div>
                  <div className="col-sm-7 d-flex align-items-center">
                    <h6 className="fs-18 m-0 mr-4">Total Revenue</h6>
                    <div className="badge badge-danger">{moneyFormat.to(revenue)}</div>
                  </div>
                  <div className="col-sm-1 text-right d-flex align-items-center justify-content-end">
                    <CgCloseO onClick={() => setIsVisible(!isVisible)} className="text-muted pointer" size={30} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
}

export default SuperAdminParkMonthlyFunds;
