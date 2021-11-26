import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { ThreeDots } from 'react-loading-icons';
import { ImSearch } from 'react-icons/im';
import { TextField } from '../../FormField';
import { catchAxiosErrors } from '../../../utils';
import { getRequest } from '../../../utils/axiosClient';
import { isEmpty } from 'lodash';
import RideResults from '../RideResults/RideResults';
import { useRecoilState } from 'recoil';
import { userSearchRidesResultAtom } from '../../../recoil/userSearchRidesResult';
import './BookRide.css';
import 'animate.css';

const initialFormVal = () => {
  return {
    starting_point: '',
    destination : ''
  }
}

const searchRideSchema = object().shape({
  starting_point: string()
    .required('Required!'),
  destination: string()
    .required('Required!')
});

const BookRide = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [searchRideResult, setSearchRideResult] = useRecoilState(userSearchRidesResultAtom);
  const [hasSearch, setHasSearch] = useState(false);

  return (
    <Fragment>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <h5 className="font-w600 letter__wide text-uppercase mb-4">Search For Rides</h5>
              <Formik
                initialValues={initialFormVal()}
                validationSchema={searchRideSchema}
                onSubmit={ async (values) => {
                  try {
                    setIsLoading(true);
                    setHasSearch(false);
                    const { data, status, statusText } = await getRequest(`/get-search-rides`, {params: values});

                    if (data) {
                      console.log(data, status, statusText);
                      setSearchRideResult(data);
                      setTimeout(() => {
                        setHasSearch(true);
                      }, 0);
                      setIsLoading(false);
                    }

                  } catch (err) {
                    catchAxiosErrors(err, setIsLoading, null);
                  }
                }}
              >
                {props => (
                  <Form>
                    <div className="row">

                      <div className="col-sm-12 col-md-5 mb-sm-3 search__col">
                        <label htmlFor="starting_point" className="text-label fs-5 m-0">Starting Point</label>
                        <Field type="text" name="starting_point" as={TextField} placeholder="e.g Abuja" />
                        <ErrorMessage name="starting_point">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-5 mb-sm-3 search__col">
                        <label htmlFor="destination" className="text-label fs-5 m-0">Destination</label>
                        <Field type="text" name="destination" as={TextField} placeholder="e.g Lagos" />
                        <ErrorMessage name="destination">
                          {msg => <div className="error-msg text-danger">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="col-sm-12 col-md-2 card_actions">
                        { isLoading
                          ? <ThreeDots className="animate__animated animate__fadeIn" width={'5rem'} stroke="#FE634E" />
                          : <button 
                              disabled={(isEmpty(props.errors) && props.isValid) ? false : true} 
                              type="submit" 
                              className="btn btn-danger btn-search btn-block btn-search m-0 animate__animated animate__fadeIn"
                            >
                              <ImSearch className="mr-2" size={20} />
                              Search
                            </button> 
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
      
      {hasSearch && <RideResults />}
    </Fragment>
  );
}

export default BookRide;
