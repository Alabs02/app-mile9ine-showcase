import { Fragment, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import _, { isEmpty } from 'lodash';
import { object, string } from 'yup';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { TiEdit } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ThreeDots } from 'react-loading-icons';
import { parkStaffAtom, withParkStaffQuery } from '../../../recoil/parkStaff';
import NoEntity from '../../NoEntity';
import { catchAxiosErrors, getToken, transformToFormData } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import './StaffList.css';
import 'animate.css';
import { toast } from 'react-toastify';
import { TextField } from '../../FormField';

const initialFormData = (staff) => {
  return {
    name: _.get(staff, 'name', null),
    email: _.get(staff, 'email', null),
  };
}

const updateStaffSchema = object().shape({
  name: string()
    .min(4, 'Too Short')
    .max(70, 'Too Long')
    .required('Required'),
  email: string()
    .email('Invalid Email')
    .required('Required'),
});

export const StaffModalFooter = ({ values, isValid, errors, staff, modalID }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [parkStaff, setParkStaff] = useRecoilState(parkStaffAtom);

  const updateState = (sId) => {
    const index = _.findIndex(parkStaff, (o) => o.id === sId);
    const staffData = parkStaff[index];

    if (index === -1) {
      console.log('no match');
    } else {
      setParkStaff([
        ...parkStaff.slice(0, index),
        staffData,
        ...parkStaff.slice(index+1)
      ]);
    }
  }

  const updateParkStaff = async (staffId) => {
    try {
      setIsLoading(true);

      const { data, status, statusText } = await postRequest(`/park_admin/update-agent/${staffId}`, transformToFormData(values), {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        toast.success(`Updated Successfully!`);
        updateState(staff?.agent.id);
        setIsLoading(false);
        setTimeout(() => {
          document.getElementById(`${modalID}`).click();
        }, 100);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading, null);
    }
  }

  return (
    <Fragment>
      <div className="mt-3 d-flex justify-content-end align-items-center">
        <button id="close_update_staff_modal" type="button" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
        { isLoading
          ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
          : <button onClick={() => updateParkStaff(_.get(staff, 'agent.id', null))} type="button" disabled={(isEmpty(errors) && isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Update</button>
        }
      </div>
    </Fragment>
  );
}

export const StaffTableActions = ({ uid, loaderId, staff }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [parkStaff, setParkStaff] = useRecoilState(parkStaffAtom);

  console.log('Local Component Staff State:', parkStaff);

  const removeParkStaff = async (staffId) => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_admin/delete-agent/${staffId}`, null, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        setParkStaff(parkStaff.filter(staff => staff?.id !== staffId));
        toast.success(`Deleted Staff Successfully!`);
        setIsLoading(false);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading, null);
    }
  }

  return (
    <Fragment>
      <div id={uid} className="d-flex align-items-center">
        <span data-toggle="modal" data-target={`#updateStaffModal${uid}`} id={`${uid}${loaderId}`} className="pointer pointer-scale mr-4">
          <i><TiEdit className="text-secondary" size={"25px"} /></i>
        </span>

        {/* Update Modal */}
        <div id={`updateStaffModal${uid}`} className="modal fade" tabIndex={-1} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Park Staff</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <AiOutlineCloseCircle />
                </button>
              </div>

              <div className="modal-body text-left">
                <Formik
                  initialValues={initialFormData(staff)}
                  validationSchema={updateStaffSchema}
                >
                  {props => (
                    <Form>
                      <div className="row">
                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="name" className="text-label fs-6 m-0">Name</label>
                          <Field name="name" type="text" as={TextField} placeholder="e.g John Snow" />
                          <ErrorMessage name="name">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 col-md-12 mb-3">
                          <label htmlFor="name" className="text-label fs-6 m-0">Email</label>
                          <Field name="email" type="email" as={TextField} placeholder="e.g snow@gmail.com" />
                          <ErrorMessage name="email">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>
                      </div>

                      <StaffModalFooter 
                        values={props.values}
                        isValid={props.isValid}
                        errors={props.errors}
                        staff={staff}
                        modalID={`updateStaffModal${uid}`}
                      />
                    </Form>
                  )}
                </Formik>
              </div>

            </div>
          </div>
        </div>
        {/* Update Modal */}

        { isLoading
          ? <span id={loaderId} className="mr-4">
              <ThreeDots className="animate__animated animate__pulse" fill={"#FE634E"} height={"1rem"} width={"1.8rem"} /> 
            </span>
          : <span onClick={() => removeParkStaff(_.get(staff, 'agent.id', null))} className="pointer pointer-scale mr-4">
              <i><RiDeleteBin6Line className="text-primary" size={"25px"} /></i>
            </span>
        }
      </div>
    </Fragment>
  );
}

const StaffList = () => {

  const staffArray = useRecoilValue(withParkStaffQuery);
  const [parkStaff, setParkStaff] = useRecoilState(parkStaffAtom);

  console.log('Staff Array:', staffArray);
  console.log('Local Staff Atom:', parkStaff);

  return (
    <Fragment>
      {(!isEmpty(staffArray))
        ? <div className="row">
            <div className="col-xl-12">
              <div className="table-responsive">
                <table className="table card-table display dataTablesCard rounded-xl">
                  <thead>
                    <tr>
                      <th>
                        <div className="checkbox mr-0 align-self-center">
                          <div className="custom-control custom-checkbox ">
                            <input type="checkbox" className="custom-control-input" id="checkAll" required />
                            <label className="custom-control-label" htmlFor="checkAll" />
                          </div>
                        </div>
                      </th>
                      <th><strong className="text-muted">S/N</strong></th>
                      <th><strong className="text-muted">Staff Code</strong></th>
                      <th><strong className="text-muted">Name</strong></th>
                      <th><strong className="text-muted">Email</strong></th>
                      <th><strong className="text-muted">Wallet Balance</strong></th>
                      <th><strong className="text-muted">Actions</strong></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(staffArray.map((staff, index) => (
                      <tr key={_.get(staff, 'id', null)}>
                        <td>
                          <div className="checkbox mr-0 align-self-center">
                            <div className="custom-control custom-checkbox ">
                              <input type="checkbox" className="custom-control-input" id="customCheckBox2" required />
                              <label className="custom-control-label" htmlFor="customCheckBox2" />
                            </div>
                          </div>
                        </td>
                        <td>{index+=1}</td>
                        <td>
                          <div className="badge badge-danger light">{_.get(staff, 'agent.agent_code', null)}</div>
                        </td>
                        <td>{_.get(staff, 'name', null)}</td>
                        <td>{_.get(staff, 'email', null)}</td>
                        <td>
                          <div className="badge badge-primary">₦{_.get(staff, 'agent.agent_wallet_amount', null)}</div>
                        </td>
                        <td>
                          <StaffTableActions
                            uid={`staffAction${_.get(staff, 'id', null)}`}
                            loaderId={`staffBtn${index}${_.get(staff, 'id', null)}`}
                            staff={staff}
                          />
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>  
        : <NoEntity 
            title={"No Park Staff At This Time"}
            copy={"Goto the Fund Staff page in other to add new staff."}
            imgUrl={
              <img alt="" src="data:image/svg+xml;base64,PHN2ZyBpZD0iZWJjN2M5NWUtN2JmMC00NWFhLWI0N2QtNmFjYzFiYWVkZjM0IiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9Ijg2Mi43MDMyMyIgaGVpZ2h0PSI2NDQuNzg1OTIiIHZpZXdCb3g9IjAgMCA4NjIuNzAzMjMgNjQ0Ljc4NTkyIj48cG9seWdvbiBwb2ludHM9IjYyOS45NDMgNjEyLjY0NCA2MTIuNzc3IDYxMi42NDQgNjA0LjYwOCA1NDYuNDM1IDYyOS45NDMgNTQ2LjQzNSA2MjkuOTQzIDYxMi42NDQiIGZpbGw9IiM5ZTYxNmEiLz48cGF0aCBkPSJNODA3LjY1MTA3LDc2OS45OTIxNUg3OTUuMzQxMTJsLTIuMTk3MjctMTEuNjIyMDUtNS42Mjc1NCwxMS42MjIwNUg3NTQuODY3MzhBNy4zMzkxOSw3LjMzOTE5LDAsMCwxLDc1MC42OTcsNzU2LjYxMzVsMjYuMDcyNDctMTguMDA2NTh2LTExLjc0OTVsMjcuNDIzNjgsMS42MzY4M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMyZjJlNDEiLz48cG9seWdvbiBwb2ludHM9IjczMS45MjMgNTkwLjk4MSA3MTguMTQ4IDYwMS4yMjQgNjcyLjA4NSA1NTIuOTY5IDY5Mi40MTUgNTM3Ljg1MSA3MzEuOTIzIDU5MC45ODEiIGZpbGw9IiM5ZTYxNmEiLz48cGF0aCBkPSJNOTI1LjU4ODE2LDczNy4wNDc5MSw5MTUuNzEsNzQ0LjM5MzQ0bC04LjY5ODI3LTguMDE1LDIuNDE5MjIsMTIuNjg0MTktMjYuMTk5MjMsMTkuNDgyMTFhNy4zMzkxOCw3LjMzOTE4LDAsMCwxLTExLjMyOTc2LTguMjQ3MjFsMTAuMTc3MTItMzAuMDA3MjgtNy4wMTExLTkuNDI4NDIsMjIuOTgyOTQtMTUuMDUwNjZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjY0ODM4IC0xMjcuNjA3MDQpIiBmaWxsPSIjMmYyZTQxIi8+PHBhdGggZD0iTTgxOC41NzU4MywzOTguNjQ3MDVzMzIuNTY4NzksMjguMTM3OTEsMTcuNTQyLDEwOC4zNTIwN2wtMTguMzQ1NCw3OC41OTY1Myw1OS44Mjk0LDk5LjI1NjEtMTkuMDc2NjQsMjMuMjA3NzEtNzcuNzc5NjEtMTA3LjQzMzQtMjguMTg1MjktNjYuMTEzNjVMNzQ0LjY1MTYsNDE2Ljg0M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMyZjJlNDEiLz48cG9seWdvbiBwb2ludHM9IjU5OS40NDcgNDI1Ljc0NiA1OTcuNDg4IDQ1Ni4wODQgNjAzLjQ4MyA1ODUuMzY1IDYzMS42OTIgNTgwLjQ1MiA2MzcuMDgzIDQ4OC40MDYgNTk5LjQ0NyA0MjUuNzQ2IiBmaWxsPSIjMmYyZTQxIi8+PHBvbHlnb24gcG9pbnRzPSIyMzcuNDQ1IDYyOC4yMTEgMjUyLjc5NiA2MjguMjEgMjYwLjA5OCA1NjkuMDAxIDIzNy40NDMgNTY5LjAwMiAyMzcuNDQ1IDYyOC4yMTEiIGZpbGw9IiNmZmI2YjYiLz48cGF0aCBkPSJNNDAyLjE3OCw3NTAuODA2MTJsNC4zMjA3NC0uMDAwMTgsMTYuODY4ODgtNi44NjAxOCw5LjA0MTIsNi44NTkxM0g0MzIuNDFBMTkuMjY2NDgsMTkuMjY2NDgsMCwwLDEsNDUxLjY3NTQ2LDc3MC4wN3YuNjI2MDVsLTQ5LjQ5NjU4LjAwMTgzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iIzJmMmU0MSIvPjxwb2x5Z29uIHBvaW50cz0iMjk2LjkzMiA2MTguNTM4IDMxMS45MDUgNjIxLjkxOCAzMzIuMDcxIDU2NS43NzIgMzA5Ljk3MiA1NjAuNzgyIDI5Ni45MzIgNjE4LjUzOCIgZmlsbD0iI2ZmYjZiNiIvPjxwYXRoIGQ9Ik00NjIuODY0NjMsNzQwLjM5MzI5bDQuMjE0NjUuOTUxNiwxNy45NjU2OC0yLjk3NTgzLDcuMzA4Miw4LjY4MjIzLjAwMTIuMDAwMjdhMTkuMjY2NDgsMTkuMjY2NDgsMCwwLDEsMTQuNTQ4NTQsMjMuMDM1NjlsLS4xMzc5LjYxMDY3TDQ1OC40ODM3OSw3NTkuNzk2N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMyZjJlNDEiLz48cGF0aCBkPSJNMzg2LjY1MTYsMzkzLjg0M2MtNy4xOTcwOCwyMS43MDYzNi02LjQzNjE4LDQ1LjI2OCwxLjcyOTkyLDcwLjU1NjA2bDMuNDkwODcsMTQyLjM3ODIxUzM4Ni42NzEyOCw3MDAuMTQ2LDQwMy40NTQzLDczMy4wMDE3N2gyNC4zNGwxMi4wNTExMi0xMzQuNzUxMjksMS41MTMzLTkwLjQ0NTkxLDUyLjE4MjQ0LDc2LjMwNTgzTDQ2MC4zMDQ2Miw3MzAuNzk4NjhsMjkuOTU2OCwyLjY3OCw1My45MzQwOC0xNTkuMTkwOUw0NzcuNjUxNiw0MTkuODQzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iIzJmMmU0MSIvPjxwYXRoIGQ9Ik02NjcuMzQ2LDMzMi4wMTQ4N2MxOC42MTczMi0xNi43NzY1Niw0Ni4zMDg5My0yNS4yMTIwOCw2OS41MzcxNC0xNS44MDVhMTE1LjQ2NiwxMTUuNDY2LDAsMCwwLTUxLjg4OCw1OS45MzQ4NGMtMy42OTc5LDkuODM4NDYtNi43ODY0NCwyMS4xNjYyMy0xNS44ODE4OCwyNi40MzM0OS01LjY1OTMzLDMuMjc3NTMtMTIuNzAwMjcsMy40Mzc3LTE5LjA0NTY4LDEuODU1NTctNi4zNDU2OC0xLjU4MjM3LTEyLjE2MjI2LTQuNzU0MTUtMTcuODk5MTMtNy44OTQyMmwtMS42MzIxOC0uMDM2OTFDNjM3Ljg2NDA2LDM3Mi41MzY4Miw2NDguNzI4NzIsMzQ4Ljc5MTQyLDY2Ny4zNDYsMzMyLjAxNDg3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2U2ZTZlNiIvPjxwYXRoIGQ9Ik03MzYuNzUzMjgsMzE2LjcxOTQyQTk4LjY5MjM5LDk4LjY5MjM5LDAsMCwwLDY4MS44NDcsMzQyLjY0OTk0YTQyLjUwMDQ5LDQyLjUwMDQ5LDAsMCwwLTguMzQ1MzQsMTAuMzc2NjcsMjQuMzc1ODQsMjQuMzc1ODQsMCwwLDAtMi44MTc1MSwxMi41MTU2OGMuMTAwNTQsNC4wNTgzMy42NzMzNSw4LjE5NzkyLS4yMTQzOCwxMi4yMWExNC45MjUzNywxNC45MjUzNywwLDAsMS03LjQyNDU0LDkuNjg4NjVjLTQuNTQ1ODYsMi42MTMtOS43NTk1LDMuNDM2NzMtMTQuODg2LDQuMDY1MS01LjY5Mi42OTc2OS0xMS42MTUyNiwxLjMzMjE5LTE2LjU0MjM4LDQuNTI0OC0uNTk3LjM4NjgzLTEuMTYyMzEtLjU2MjExLS41NjYyMi0uOTQ4MzYsOC41NzIzNS01LjU1NDYsMTkuNDE5NjktMy41MzM1LDI4LjYzNzI0LTcuMjQwNjUsNC4zMDEwOC0xLjcyOTgzLDguMTA2OTEtNC43NjYzMSw5LjQ1NC05LjM1NzE5LDEuMTc3OTQtNC4wMTQ1Mi41OTA5LTguMjgzOC40NTM1OS0xMi4zOTIwN2EyNi4wMTA2OCwyNi4wMTA2OCwwLDAsMSwyLjI5OS0xMi4zNDAyOCwzOS4yOTAzOCwzOS4yOTAzOCwwLDAsMSw3LjkxNTYtMTAuNjU5MjQsOTUuNzQ5MTcsOTUuNzQ5MTcsMCwwLDEsMjQuMzMzMy0xNy40MTk3OEExMDAuNDQyNTYsMTAwLjQ0MjU2LDAsMCwxLDczNi43NDMsMzE1LjYxNDc1Yy43MDMxOS0uMDkwNjUuNzA4ODYsMS4wMTQ2MS4wMTAyNiwxLjEwNDY3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik02ODYuNDQ3MTgsMzM3Ljc5MTM0YTE0LjgwNywxNC44MDcsMCwwLDEsMS42MzI0MS0xOS4xMDM5Yy41MDYyOC0uNDk4NzMsMS4zMDUwNi4yNjQ1Ny43OTgxMS43NjRhMTMuNzEwOTQsMTMuNzEwOTQsMCwwLDAtMS40ODIxNiwxNy43NzM3MWMuNDE1MTIuNTc2OS0uNTM1NjEsMS4xMzk4My0uOTQ4MzYuNTY2MjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjY0ODM4IC0xMjcuNjA3MDQpIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTY3MC4zNjIxNiwzNjMuNDkxMjdhMjguNTM5MzIsMjguNTM5MzIsMCwwLDAsMjAuMzkzOC00LjA4MzQ2Yy41OTgzNC0uMzg0NzEsMS4xNjM4NC41NjQxMi41NjYyMi45NDgzNmEyOS42ODUxNywyOS42ODUxNywwLDAsMS0yMS4yMzAyMyw0LjIwNjA3Yy0uNzAwODUtLjEyNjI2LS40MjY4My0xLjE5NjU1LjI3MDIxLTEuMDcxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik03MTQuNDQ2NTYsMzIxLjk0NzhhOC4zODE0OCw4LjM4MTQ4LDAsMCwwLDYuMjY4Niw0Ljg5NDQzYy43MDIxLjExNzMyLjQyNzMyLDEuMTg3NTMtLjI3MDIxLDEuMDcxYTkuMzkyMTMsOS4zOTIxMywwLDAsMS02Ljk0Njc1LTUuMzk5MTcuNTcwODQuNTcwODQsMCwwLDEsLjE5MTA3LS43NTczLjU1NTA2LjU1NTA2LDAsMCwxLC43NTcyOS4xOTEwN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNzYyLjQ2MTI0LDM5Ny4xMTQ1NGMtLjQ0MDQ4LS4wNjA3OS0uODgxLS4xMjE1Ny0xLjMyNzkxLS4xNzU2YTExMC4zNzg2MiwxMTAuMzc4NjIsMCwwLDAtMTcuODgyMDgtLjkwODM5Yy0uNDYyMjEuMDA2NzMtLjkzMDUzLjAyMDUxLTEuMzkxNTkuMDQwNWExMTYuMzY0NiwxMTYuMzY0NiwwLDAsMC00MS43NTAxNSw5LjYxMDE0LDExMy4wMDQ4MiwxMTMuMDA0ODIsMCwwLDAtMTUuMTYyOTEsOC4wNTU1Yy02LjY4NzczLDQuMjM0MzgtMTMuNjAyLDkuMzU3NjQtMjEuMDc4LDExLjA4NDU5YTE5LjM4NTg0LDE5LjM4NTg0LDAsMCwxLTIuMzYyMTcuNDIwODZsLTMwLjg4ODY0LTI2Ljc0NTQ2Yy0uMDM5NjktLjA5Ni0uMDg1OC0uMTg1MzEtLjEyNTg0LS4yODE2MmwtMS4yODIxMi0xLjAxMTQ3Yy4yMzg3Mi0uMTc1NTYuNDkwMDgtLjM1MjUxLjcyODc5LS41MjgwOC4xMzgtLjEwMjQxLjI4My0uMTk4ODcuNDIxLS4zMDEyOC4wOTQyMi0uMDY2MzkuMTg4ODEtLjEzMjUzLjI3LS4xOTc4Mi4wMzEyOC0uMDIyMjIuMDYyOS0uMDQ0MTMuMDg4MTEtLjA1OTM0LjA4MTIyLS4wNjUyOS4xNjM2LS4xMTczMi4yMzg3MS0uMTc1NTZxMi4xMDM0NS0xLjQ4OTUsNC4yMzUxNi0yLjk1NDYzYy4wMDYxMS0uMDA3LjAwNjExLS4wMDcuMDE5MS0uMDA4MTVhMTY2LjE1Njg5LDE2Ni4xNTY4OSwwLDAsMSwzNC42MDEtMTguNTk5MzljLjM2Njg2LS4xMzg1OS43Mzk0OC0uMjg0NTMsMS4xMjA0NS0uNDEwOWExMDcuODMxLDEwNy44MzEsMCwwLDEsMTYuOTM5MTktNC43NjY1MSw5NS4zMjg3OCw5NS4zMjg3OCwwLDAsMSw5LjU1MjgtMS4zMzQzMyw3OS4yNzIsNzkuMjcyLDAsMCwxLDI0LjcyMzM1LDEuNzUxNmMxNi4xNDMzMiwzLjc0MzMsMzAuOTA5NzcsMTIuNjA3ODUsMzkuNjU1NzgsMjYuNDMyNTRDNzYyLjAyNjg4LDM5Ni40MDU1NSw3NjIuMjQzODcsMzk2Ljc1MzY3LDc2Mi40NjEyNCwzOTcuMTE0NTRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjY0ODM4IC0xMjcuNjA3MDQpIiBmaWxsPSIjZTZlNmU2Ii8+PHBhdGggZD0iTTc2Mi4wNTIzNSwzOTcuNDQ2NDVhOTguNjkyMzYsOTguNjkyMzYsMCwwLDAtNTkuNDUxNTYtMTIuMzUzM0E0Mi41MDAwNiw0Mi41MDAwNiwwLDAsMCw2ODkuNjksMzg4LjM1Mzg3YTI0LjM3NTgsMjQuMzc1OCwwLDAsMC05Ljc4NDkzLDguMjk2NzNjLTIuMzYzMTMsMy4zMDA4OC00LjM5ODA4LDYuOTUxLTcuNTIyNDUsOS42MmExNC45MjUzMywxNC45MjUzMywwLDAsMS0xMS43NjEzMiwzLjI2NTc1Yy01LjIwMjgtLjY1MDYtOS44NjE1Ni0zLjEzMTg1LTE0LjMzMzEtNS43MTY2NC00Ljk2NDgtMi44Njk5MS0xMC4wNzYyLTUuOTI5NTEtMTUuOTMyNDEtNi4zNDY4NS0uNzA5NTYtLjA1MDU2LS41ODk2LTEuMTQ4NjEuMTE4ODgtMS4wOTgxMiwxMC4xODg4LjcyNjExLDE3LjYzMyw4Ljg3MDcsMjcuMjI0NjIsMTEuNDYwMzUsNC40NzU2NCwxLjIwODM3LDkuMzQyNTYsMS4wNzUyOCwxMy4xODIxMy0xLjc3OTI1LDMuMzU3NTQtMi40OTYxNyw1LjQ1OTIzLTYuMjU4MzksNy44MjMwNS05LjYyMTI5YTI2LjAxMDgyLDI2LjAxMDgyLDAsMCwxLDkuMjY1MjktOC40Njg4OSwzOS4yOTAzNywzOS4yOTAzNywwLDAsMSwxMi43Mzc3Ny0zLjc0NTA2LDk1Ljc0OTA3LDk1Ljc0OTA3LDAsMCwxLDI5LjkxNjY5Ljc0MTYsMTAwLjQ0MjYzLDEwMC40NDI2MywwLDAsMSwzMi4wODUsMTEuNTk2MTFjLjYxNi4zNTEtLjA0NDg4LDEuMjM2ODgtLjY1Njg5Ljg4ODE5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik03MDkuMTk5LDM4My45ODM0NWExNC44MDcsMTQuODA3LDAsMCwxLDEyLjgwNTI2LTE0LjI3MDU3Yy43MDQ1LS4wOTMzOS44ODI3Mi45OTcuMTc3MjksMS4wOTA1YTEzLjcxMSwxMy43MTEsMCwwLDAtMTEuODg0NDMsMTMuMjk4OTVjLS4wMTU4OC43MTA1Ni0xLjExMzkxLjU4NzYxLTEuMDk4MTItLjExODg4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik02ODAuODgyODcsMzk0LjgxOTExYTI4LjUzOTI4LDI4LjUzOTI4LDAsMCwwLDE4Ljc0MTgzLDkuMDE4MDZjLjcwOTM2LjA1MzA4LjU4OTYzLDEuMTUxMTMtLjExODg4LDEuMDk4MTJhMjkuNjg1MTgsMjkuNjg1MTgsMCwwLDEtMTkuNDgzNS05LjQyMzc1Yy0uNDgzNTctLjUyMjc3LjM3OTYxLTEuMjEyMzYuODYwNTUtLjY5MjQzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik03NDEuMDkzODMsMzg4LjE5MDg0YTguMzgxNDcsOC4zODE0NywwLDAsMCwyLjA1ODM0LDcuNjgyMDVjLjQ5LjUxNjM4LS4zNzM3OCwxLjIwNTQ1LS44NjA1NS42OTI0M2E5LjM5MjE2LDkuMzkyMTYsMCwwLDEtMi4yOTU5MS04LjQ5MzM2LjU3MDgyLjU3MDgyLDAsMCwxLC42MDg1LS40ODk2Mi41NTUwNi41NTUwNiwwLDAsMSwuNDg5NjIuNjA4NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjE5LjkyMTYyLDc1NC43NDI5M2MtMS40NSw1LjQ0LTUuMjYsOS45Ny05Ljg2LDEzLjI3LS43NS41NC0xLjUyLDEuMDQtMi4zLDEuNTEtLjI0LjE0LS40OC4yOS0uNzMuNDJxLS40MDUuMjQtLjgxLjQ1aC0yMS42M2MtLjM5LS43OS0uNzctMS41OS0xLjE1LTIuMzgtOS4yNy0xOS40OC0xNS43OC00MC41LTE0LjY3LTYxLjkxYTc5LjI1NDE3LDc5LjI1NDE3LDAsMCwxLDUuMTctMjQuMjVjNS45NC0xNS40NywxNi43OC0yOC44NiwzMS42OS0zNS42LjM3LS4xNy43Ni0uMzQsMS4xNC0uNS0uMTIuNDMtLjI0Ljg1LS4zNiwxLjI4YTExMC43ODUzMywxMTAuNzg1MzMsMCwwLDAtMy4zOCwxNy41OWMtLjA2LjQ2LS4xMS45Mi0uMTUsMS4zOWExMTYuMDU0MjcsMTE2LjA1NDI3LDAsMCwwLDMuNzIsNDIuNjljLjAxLjAzLjAxOTk1LjA3LjAzLjFxMS4yNzUwNiw0LjYwNSwyLjk2LDkuMDdjLjg4LDIuMzUsMS44Myw0LjY3LDIuODcsNi45NUMyMTYuODAxNjMsNzM0LjM5MywyMjIuNjIxNTcsNzQ0LjU5MywyMTkuOTIxNjIsNzU0Ljc0MjkzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2U2ZTZlNiIvPjxwYXRoIGQ9Ik0yMDcuMDQxNjIsNjQ2LjIwM2MtLjIxLjI4LS40MjAwNS41NS0uNjMuODNhOTguMTI4ODUsOTguMTI4ODUsMCwwLDAtMTEuMTIsMTguNzZjLS4xNi4zMy0uMzEuNjYtLjQ0LDFhOTcuODEzNSw5Ny44MTM1LDAsMCwwLTcuODIsMjkuMjQsMS40OSwxLjQ5LDAsMCwwLS4wMi4yMWMtLjI1LDIuMzYwMDUtLjQsNC43NC0uNDYsNy4xMmE0Mi40ODAxMSw0Mi40ODAxMSwwLDAsMCwxLjQzLDEzLjI0LDIzLjc2ODgsMjMuNzY4OCwwLDAsMCw1LjQ2LDkuNDJjLjI1LjI3LjUuNTQuNzcuOC4yLjIxLjQyLjQyLjYzLjYyLDIuMDIsMS45Myw0LjIzLDMuNzIsNi4xMyw1Ljc5YTIxLjQzMTYzLDIxLjQzMTYzLDAsMCwxLDIuMzUsMywxNC45MDQwNywxNC45MDQwNywwLDAsMSwxLjYsMTIuMWMtMS4zNiw1LjA2LTQuNDcsOS4zMy03LjY1LDEzLjQtMS41OSwyLjA0LTMuMjMsNC4xLTQuNjUsNi4yOC0uNTE5OTUuNzgtMSwxLjU3LTEuNDM5OTQsMi4zOGgtMS4yNmMuNDItLjgxLjg4LTEuNiwxLjM4LTIuMzgsMy42NS01Ljc1LDguODQtMTAuNjksMTEuNTMtMTcuMDIsMS44Mi00LjI2OTk1LDIuMzctOS4xMS4wNy0xMy4zYTE3LjY4MTU2LDE3LjY4MTU2LDAsMCwwLTIuNDMtMy4zOGMtMS44My0yLjA3LTQuMDItMy44NC02LjAxLTUuNzEtLjUtLjQ3LS45OS0uOTUtMS40Ni0xLjQ1YTI0Ljk2Mzc3LDI0Ljk2Mzc3LDAsMCwxLTUuNjQtOC45LDM5LjIzMDI4LDM5LjIzMDI4LDAsMCwxLTEuOTQtMTMuMTNjMC0yLjg0LjE1LTUuNy40My04LjU0LjAzLS4zNi4wNy0uNzMuMTEtMS4xYTEwMC43NjY2MywxMDAuNzY2NjMsMCwwLDEsMTkuNjctNDkuMjNjLjItLjI4LjQxLS41NS42Mi0uODJDMjA2LjY4MTYzLDY0NC44NzI5NCwyMDcuNDcxNjEsNjQ1LjY1MywyMDcuMDQxNjIsNjQ2LjIwM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTg2LjM2NTI2LDY5Ni42Nzc2M2ExNC44MDcsMTQuODA3LDAsMCwxLTEyLjM1NDItMTQuNjYyNzguNTUyNzUuNTUyNzUsMCwwLDEsMS4xMDQ1NS0uMDI0MTUsMTMuNzExLDEzLjcxMSwwLDAsMCwxMS41MTk4NiwxMy42MTZjLjcwMTQ3LjExNDM5LjQyNzI1LDEuMTg0NzEtLjI3MDIxLDEuMDcxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xOTMuMTY0LDcyNi4yMjQwNmEyOC41MzkzLDI4LjUzOTMsMCwwLDAsMTEuNTMzMTUtMTcuMzA4Yy4xNTEwNi0uNjk1MTIsMS4yMjE4Ni0uNDI0MDcsMS4wNzEuMjcwMjFhMjkuNjg1MTQsMjkuNjg1MTQsMCwwLDEtMTIuMDM3OSwxNy45ODYxOWMtLjU4NDg1LjQwNjI5LTEuMTQ3OS0uNTQ0MjgtLjU2NjIyLS45NDgzNloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTk0Ljk2MDc1LDY2NS42NzZhOC4zODE0OSw4LjM4MTQ5LDAsMCwwLDcuODkzNDUtLjk3MTY4Yy41Nzk0MS0uNDEzNTEsMS4xNDE4Ni41Mzc1NC41NjYyMi45NDgzNmE5LjM5MjE1LDkuMzkyMTUsMCwwLDEtOC43Mjk4OSwxLjA5NDI5LjU3MDgyLjU3MDgyLDAsMCwxLS40MDAzOC0uNjcwNTkuNTU1MDcuNTU1MDcsMCwwLDEsLjY3MDYtLjQwMDM4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yODIuMDYxNTgsNjg0Ljg3Mjk0Yy0uMzUuMjctLjcxLjU0LTEuMDYuODJhMTEwLjM2MiwxMTAuMzYyLDAsMCwwLTEzLjI5LDEyYy0uMzIuMzMtLjY0LjY3LS45NSwxLjAxbC0uMDEuMDFhMTE2LjM0NywxMTYuMzQ3LDAsMCwwLTIyLjY2LDM2LjE0bC0uMDMuMDljLS4wMS4wMy0uMDIuMDUtLjAzLjA4YTExNC40NDMyMSwxMTQuNDQzMjEsMCwwLDAtNS4wMywxNi40MmMtMS4yMiw1LjQ2LTIuMjIsMTEuMzEtNC4xMywxNi41Ny0uMjkuODEtLjYxLDEuNjEtLjk1LDIuMzhoLTQ0LjQ2Yy4xNS0uNzkuMzEtMS41OS40Ny0yLjM4YTE2MC4zMDE2OCwxNjAuMzAxNjgsMCwwLDEsMTAuNTQtMzMuN2MuMTYtLjM2LjMyLS43Mi41LTEuMDhhMTA4LjMwNDc4LDEwOC4zMDQ3OCwwLDAsMSw4LjYxLTE1LjM1LjAwOTguMDA5OCwwLDAsMSwuMDEtLjAxLDk0Ljk1NTg1LDk0Ljk1NTg1LDAsMCwxLDUuOC03LjY5LDc5LjExODcxLDc5LjExODcxLDAsMCwxLDE4LjcyLTE2LjI0Yy4wNC0uMDMuMDktLjA1LjEzLS4wOCwxNC4wNC04LjcxLDMwLjY4LTEyLjg2LDQ2LjU5LTkuMjdoLjAxQzI4MS4yNTE1OCw2ODQuNjgyOTQsMjgxLjY1MTYsNjg0Ljc3MywyODIuMDYxNTgsNjg0Ljg3Mjk0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2U2ZTZlNiIvPjxwYXRoIGQ9Ik0yODIuMDExNTksNjg1LjQwM2MtLjM0LjA5LS42OC4xOS0xLjAxLjI5YTk4LjU4ODgsOTguNTg4OCwwLDAsMC0yMC4xNyw4LjI3Yy0uMzIuMTctLjY0LjM1LS45Ni41M2E5OC4yNTU0NCw5OC4yNTU0NCwwLDAsMC0yMy43OSwxOC41OS4wMzUuMDM1LDAsMCwwLS4wMS4wMmMtLjA4LjA4LS4xNy4xNy0uMjQuMjUtMS42LDEuNzItMy4xNCwzLjUxLTQuNiw1LjM1YTQyLjc2OSw0Mi43NjksMCwwLDAtNi44MiwxMS40MywyMy42NzM2NSwyMy42NzM2NSwwLDAsMC0xLjMxLDEwLjgxYy4wMy4zNy4wOC43My4xMywxLjEuMDQuMjkuMDguNTguMTMuODguNjYsNC4wMSwxLjgsOC4wMywxLjQ4LDEyLjEyYTE0LjkwOTEzLDE0LjkwOTEzLDAsMCwxLTYuMDEsMTAuNjMsMjMuNzk0LDIzLjc5NCwwLDAsMS0zLjY4LDIuMzQsMzYuODUyMzIsMzYuODUyMzIsMCwwLDEtNS43NywyLjM4aC0zLjkzYy41My0uMTUsMS4wNS0uMywxLjU4LS40NWE0OC4yMTE4Miw0OC4yMTE4MiwwLDAsMCw1LjUzLTEuOTMsMjYuOTEyLDI2LjkxMiwwLDAsMCwzLTEuNDhjNC4wMi0yLjMxLDcuMzcwMDUtNS44NSw4LjA3LTEwLjU4LjYxLTQuMTQtLjU3LTguMjgtMS4yNy0xMi4zMy0uMTItLjctLjIzLTEuMzktLjI5LTIuMDhhMjQuNDM4NTYsMjQuNDM4NTYsMCwwLDEsLjg1LTEwLjQ2LDM5LjA2MjMsMzkuMDYyMywwLDAsMSw2LjM2LTExLjY2LDgzLjM1NSw4My4zNTUsMCwwLDEsNS40OC02LjU1cS4zNi0uNDA0OTQuNzUtLjgxYTEwMC45MDEsMTAwLjkwMSwwLDAsMSwyNC4yMS0xOC43M2guMDFhOTkuMjg3ODIsOTkuMjg3ODIsMCwwLDEsMjEuMS04Ljc0aC4wMWMuMzMtLjEuNjctLjIsMS0uMjlDMjgyLjUzMTYxLDY4NC4xMjI5NCwyODIuNjkxNTgsNjg1LjIxMywyODIuMDExNTksNjg1LjQwM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjM1LjExNiw3MTMuMjUyNDNhMTQuODA3LDE0LjgwNywwLDAsMS0xLjAzNjEzLTE5LjE0NTVjLjQzMjEyLS41NjQyLDEuMzI5MTUuMDgwNzkuODk2NDYuNjQ1NzRBMTMuNzExLDEzLjcxMSwwLDAsMCwyMzUuOTc2NTMsNzEyLjU2Yy40OTEyMS41MTM2Ny0uMzcyMTUsMS4yMDMxNi0uODYwNTUuNjkyNDNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjY0ODM4IC0xMjcuNjA3MDQpIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTIyMi43NTU0Myw3NDAuOTM2OTJhMjguNTM5MzEsMjguNTM5MzEsMCwwLDAsMTkuNjI5MjEtNi44NzU3NGMuNTM5MTItLjQ2NDA2LDEuMjMwOS4zOTcuNjkyNDIuODYwNTRhMjkuNjg1MTQsMjkuNjg1MTQsMCwwLDEtMjAuNDQwNTEsNy4xMTMzMmMtLjcxMTU5LS4wMjc3Mi0uNTg4ODUtMS4xMjU2OS4xMTg4OC0xLjA5ODEyWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNjAuNjQ0MTEsNjkzLjY3NDQ0YTguMzgxNDksOC4zODE0OSwwLDAsMCw2Ljg4NzUsMy45NzY1N2MuNzExNTkuMDE4NjkuNTg4MDcsMS4xMTY2OC0uMTE4ODgsMS4wOTgxMmE5LjM5MjE1LDkuMzkyMTUsMCwwLDEtNy42MjkxNy00LjM4MjI2LjU3MDgzLjU3MDgzLDAsMCwxLC4wODQwNi0uNzc2NDkuNTU1MDcuNTU1MDcsMCwwLDEsLjc3NjQ5LjA4NDA2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik02MjUuMDMwNzYsMzAwLjczNjczYTExLjU5OTQ1LDExLjU5OTQ1LDAsMCwxLTE3Ljc2NjcuODM3NTlsLTM3LjgwMDM5LDE2LjQ0MDA5LDMuNjgyLTIxLjEwMTYxLDM1LjMzMTQtMTIuMzc2NjhhMTEuNjYyMzUsMTEuNjYyMzUsMCwwLDEsMTYuNTUzNzIsMTYuMjAwNjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjY0ODM4IC0xMjcuNjA3MDQpIiBmaWxsPSIjZmZiOGI4Ii8+PHBhdGggZD0iTTU5OS44MDU3MSwzMDcuMzI1MjVsLTg3Ljc5NzYsMzkuMTA4MzEtLjE4ODM1LS4wNjczOC0xMDAuMDY3LTM1LjY1ODg5YTMyLjk1OTY2LDMyLjk1OTY2LDAsMCwxLTE0Ljc4MTY4LTQyLjc1NTY5aDBhMzIuOTI0MjMsMzIuOTI0MjMsMCwwLDEsNDYuOTg3Mi0xNC42MzY1Mmw3NC40Njg1LDQ0Ljg1OTA4LDcyLjIxMTIxLTkuMzU4NzhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjY0ODM4IC0xMjcuNjA3MDQpIiBmaWxsPSIjZTZlNmU2Ii8+PHBhdGggZD0iTTEwMzEuMzUxNjIsNzcxLjIwM2ExLjE4NjUsMS4xODY1LDAsMCwxLTEuMTksMS4xOWgtODYwLjI5YTEuMTksMS4xOSwwLDAsMSwwLTIuMzhoODYwLjI5QTEuMTg2NSwxLjE4NjUsMCwwLDEsMTAzMS4zNTE2Miw3NzEuMjAzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2NjYyIvPjxwYXRoIGQ9Ik00ODEuOTkxOTMsNDI0LjQwMzUybC04OC41MDU4NS0xNC4xNTY3NGExNi44OTMzNCwxNi44OTMzNCwwLDAsMS05Ljk1NTU3LTIzLjY0Nmw0LjAxMzY3LTguMDI4MzItMS41NTkwOC04NC4zNDY2OEE2Mi40ODE1Niw2Mi40ODE1NiwwLDAsMSw0MTYuMzIxNTIsMjM5LjU3Mmw4LjYzMDg2LTUuMTYwNjQsNC4zNjE4Mi0xMS4wNzY2Niw0MC4yMjAyMi45ODEuMTE3MTgsMTQuNTI3MzQsMTQuNDAzODEsMjIuOTY4MjYtLjAwMDQ5LjA5NTIyLS45MDM4MSwxMjUuMDEzNjctMy45Njk3MiwxMi45MDEzNyw2LjAwMjQ0LDE1LjAwNTg2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2U2ZTZlNiIvPjxjaXJjbGUgY3g9IjI4NC40NTkxIiBjeT0iNDUuNDA5OTciIHI9IjM2LjU0NDEzIiBmaWxsPSIjZmZiOGI4Ii8+PHBhdGggZD0iTTQxNS4wNTM4NSwxODAuOTgzNTJjLTEuMDktNC41OTE4Ny0uNTg5NTYtMTEuMDUzNDkuMDI2NDEtMTUuNjc3LDEuNjE0ODUtMTIuMTIxMjksOC4zNDY0LTIzLjY0NDc0LDE4LjU3MzM2LTMwLjQ3MDQ4YTEzLjM3OTU3LDEzLjM3OTU3LDAsMCwxLDYuNjY0NTMtMi42NDg0NWMyLjQxOTM5LS4xMDEsNS4wNDE4OSwxLjE5NDE4LDUuNzg0NjUsMy40OTlhMTEuOTkyNTQsMTEuOTkyNTQsMCwwLDEsNi43NjU1Mi02LjcwOSwyMS4xMzU1LDIxLjEzNTUsMCwwLDEsOS42MzA3NS0xLjI5NzQ2LDM1LjE5NzI4LDM1LjE5NzI4LDAsMCwxLDI5LjM2MzA2LDIwLjk4OTQ3Yy45NzYwOSwyLjMxODgsMy43MDI0Ni02LjI0NjIxLDQuOTM5MTYtNC4wNTUyOGE5Ljc0MDcsOS43NDA3LDAsMCwwLDUuNTIzODgsNC44NTM0MmMyLjQyMzMuNjc2MTksMy40MDc1NiwxMC42NjAzNCw0LjM2MTIsOC4zMzIyMmExMS4wOTg0LDExLjA5ODQsMCwwLDEtMTAuNjEwNTUsMTUuNDc1MjVjLTIuNDY2NDItLjA5MjI4LTQuODI0ODktLjk5OTQ3LTcuMjYyLTEuMzktOC43MTUxMi0xLjM5NjQyLTE3Ljk2LDQuOTIzMTYtMTkuODIzMTIsMTMuNTUwNThhMjMuOTg2ODksMjMuOTg2ODksMCwwLDAtMy4xNTU2NS03LjAyMSw4LjExODcsOC4xMTg3LDAsMCwwLTYuNTEzMjEtMy41Nzg2NmMtMi40Nzk1Ny4wOTI3OC00LjY1OTEsMS43MTM5LTYuMjY3OTMsMy42MDI5NXMtMi44MTcxMyw0LjA5My00LjQzNzgyLDUuOTcxODZjLTQuNzU1NSw1LjUxMy0xMS4xODc0NSwxOC4zNjk3LTE3Ljk2NDUzLDE3LjQzMkM0MjUuMzAzMzUsMjAxLjEwMyw0MTYuNTQyMDYsMTg3LjI1MzA5LDQxNS4wNTM4NSwxODAuOTgzNTJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjY0ODM4IC0xMjcuNjA3MDQpIiBmaWxsPSIjMmYyZTQxIi8+PHBhdGggZD0iTTY3NC4wMTIzOCwzNDIuMTQ3NTRhNy4xMzI4LDcuMTMyOCwwLDAsMC00LjgwNzA2LTcuODUzNjNsLTk4LjQxMzE3LTMyLjc3NzA5YTcuMTMyMTksNy4xMzIxOSwwLDAsMC0yLjkzMy0uMzM2OGwtMjQuNjY2ODcsMi4zMzI2Ny0xNC4xNTM3NywxLjM0MjU1LTI2LjExODY3LDIuNDY4MzNhNy4xNTUxOSw3LjE1NTE5LDAsMCwwLTYuMzgzNTcsNS45ODk3M2wtMTMuMjYxMzUsODIuODM3NmE3LjE4NjQ2LDcuMTg2NDYsMCwwLDAsNC40ODQzOSw3Ljc5NTkybDk5LjQ0MDQsMzguMzg0NDJhNi45NDY2OSw2Ljk0NjY5LDAsMCwwLDEuNDQ2MzYuMzg4MzYsNy4xMzYyMSw3LjEzNjIxLDAsMCwwLDIuMTc1NzEuMDE2NDhsNjQuMjU1NDYtOS41MjM0OWE3LjEyMDU3LDcuMTIwNTcsMCwwLDAsNi4wMjMtNS45OTkxOVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNDkwLjAxMzQ5LDM5OC4xMTAybDk5LjQ0MDA5LDM4LjM4MjM0YS44OTcxMS44OTcxMSwwLDAsMCwuNDU3LjA1MzY2bDY0LjI0Ny05LjUyMjI0YS44ODM0Ny44ODM0NywwLDAsMCwuNzU0OS0uNzUxNjFsMTIuOTE5NzktODUuMDY2NzdhLjkwNDY5LjkwNDY5LDAsMCwwLS41OTkzNy0uOTgxNTFsLS42NjE2OS0uMjIzOTItOTcuNzU3NjItMzIuNTQ1ODhhLjY3Nzg3LjY3Nzg3LDAsMCwwLS4xMzc0Mi0uMDMzMTguODg3MzIuODg3MzIsMCwwLDAtLjIzLS4wMTE5MmwtNjAuMTY0MjYsNS42OTMyLTQuNzc0MjguNDQ3OTRhLjkwMzE0LjkwMzE0LDAsMCwwLS43OTQ3Ljc0NzgxbC0xMy4yNTksODIuODM0MzlBLjg5NzM1Ljg5NzM1LDAsMCwwLDQ5MC4wMTM0OSwzOTguMTEwMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZTYzNGUiLz48cGF0aCBkPSJNNTA4LjI4MTk0LDMxMy4xMDIzN2w2MC4xNjQyNi01LjY5MzJhLjg4NzMyLjg4NzMyLDAsMCwxLC4yMy4wMTE5Mi42Nzc4Ny42Nzc4NywwLDAsMSwuMTM3NDIuMDMzMThsOTcuNzU3NjIsMzIuNTQ1ODgtMjUuNzg2NTgsMi43Mjk2NS05LjY1MDQ2LDEuMDE2NjktMjcuNDYwNDUsMi45MDEyM2ExLjkzOSwxLjkzOSwwLDAsMS0uMjQwODEtLjAwMjljLS4wNDg4MS0uMDE0NzItLjA5NzYyLS4wMjk0NC0uMTU2MzktLjA0NTExWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iIzJmMmU0MSIvPjxwYXRoIGQ9Ik00ODcuNzU3NjEsNDAzLjk1MjA5bDk5LjQ0MDA5LDM4LjM4MjMzYTYuNzIyNDIsNi43MjI0MiwwLDAsMCwxLjQ1MDUuMzc5NjgsNy4yMjM1OCw3LjIyMzU4LDAsMCwwLDIuMTc3MjcuMDI3MjJsNjQuMjQ3LTkuNTIyMjRhNy4xMzUyMSw3LjEzNTIxLDAsMCwwLDYuMDI4MzktNi4wMDM4N2wxMi45MDk4Mi04NS4wNjc3MmE3LjE5MDE0LDcuMTkwMTQsMCwwLDAtLjQxODQtMy43MTY2OWMtLjA2NTMzLS4xNTY4OC0uMTMwNzItLjMxMzg0LS4yMDctLjQ2MTcyYTYuOTkwMzEsNi45OTAzMSwwLDAsMC0yLjI2MzY5LTIuNjk3NTgsNy4xMzc4OSw3LjEzNzg5LDAsMCwwLTEuOTE1NzktLjk3NjYybC0uMTE2NTktLjA0MTMxLTk4LjI5MTc1LTMyLjczNzUxYTguOTU1MzksOC45NTUzOSwwLDAsMC0xLjIyNzIxLS4yOTgwNyw3LjA4NTczLDcuMDg1NzMsMCwwLDAtMS43MTQ2My0uMDMzMjNsLTI0LjY2Mjk1LDIuMzI0NjgtMTQuMTUyNTMsMS4zNUw1MDIuOTE3LDMwNy4zMjU5YTcuMDkxNzMsNy4wOTE3MywwLDAsMC0zLjAxODUzLjk5NzQ0LDEuMzI5NDgsMS4zMjk0OCwwLDAsMC0uMjAyNDUuMTIxMjUsMS4xOTIyLDEuMTkyMiwwLDAsMC0uMTI5OTIuMDk4MTMsNy4xNDgxOCw3LjE0ODE4LDAsMCwwLTMuMDI2ODIsNC43NjM2N2wtMTMuMjY5OSw4Mi44NDM0NkE3LjE5NDE4LDcuMTk0MTgsMCwwLDAsNDg3Ljc1NzYxLDQwMy45NTIwOVptMTAuNTQyMTktOTAuMzU2OTRhNS4yOTk2NSw1LjI5OTY1LDAsMCwxLDEuMjY5ODQtMi42NzEzLDQuNjUxNDcsNC42NTE0NywwLDAsMSwuNjc1NzEtLjY1ODc1LDUuMzE3MTksNS4zMTcxOSwwLDAsMSwyLjMyMzY1LTEuMDgzODksNC4wNTksNC4wNTksMCwwLDEsLjUwOTE1LS4wNzE4OWw0My45ODQ2Ni00LjE1NTIxLDIwLjk2NDc5LTEuOTk1Yy4xNDIxNy0uMDE2NTguMjcyNTQtLjAxNDE4LjQwMzg2LS4wMjE2OGE1LjAwNjczLDUuMDA2NzMsMCwwLDEsLjk0NzYxLjA3MDQzLDQuMTQ0ODksNC4xNDQ4OSwwLDAsMSwuODQ0NjcuMjAxMjVsOTguNDA4NCwzMi43Nzg4MmMuMDc3NzUuMDI3NTQuMTQ1NTQuMDU0MDcuMjIzMjMuMDgxNmE1LjIxOCw1LjIxOCwwLDAsMSwyLjI3MzA1LDEuNjUzNyw1LjI1OTEyLDUuMjU5MTIsMCwwLDEsMS4xMjA3NCw0LjE0NTQxbC0xMi45MjA2OCw4NS4wNzY3NGE1LjM0OTE2LDUuMzQ5MTYsMCwwLDEtNC41MDg2LDQuNTAxNTVsLTY0LjI1Nyw5LjUyMTM0YTUuNDEzNDYsNS40MTM0NiwwLDAsMS0yLjcyMjgxLS4zMTAzOGwtOTkuNDQxLTM4LjM3MjM3YTUuNDAyMzcsNS40MDIzNywwLDAsMS0zLjM1OTIxLTUuODQ2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik00OTkuMzUyMTYsMzA4Ljk5NDM5YS44NzcyNC44NzcyNCwwLDAsMSwuMjY4LS4zODYyMywxLjA1MTMyLDEuMDUxMzIsMCwwLDEsLjEyOS0uMDg4MTdjLjA0MTY5LS4wMTYwNy4wODQzNC0uMDQyMTYuMTI2MTEtLjA1ODI4YS44NzM0OS44NzM0OSwwLDAsMSwuNjIzODMtLjAxMDY2bDIuMDY5OTQuNzMwMTYsMTAxLjExNTcsMzUuNjY5NDMsMjMuNjY1MTMtMi41MDA0LDEzLjI0Mjg4LTEuMzk2NzUsMjguMDI5MzItMi45Njc0MiwyLjUwNjM5LS4yNjI3OS40ODczMi0uMDUzODdhLjkwNDMuOTA0MywwLDAsMSwuOTUyMTYuNjUzNTIuNzM5MzguNzM5MzgsMCwwLDEsLjAyNjQ5LjE0MzEzLjg5My44OTMsMCwwLDEtLjU1MDE0LjkyMTg4Ljk4ODQzLjk4ODQzLDAsMCwxLS4yNDc1Mi4wNjY3M2wtMy40MDk0NC4zNTczOC0yNy42MDI2OCwyLjkxNzc1LTkuNjUwNDYsMS4wMTY2OS0yNy40NjA0NSwyLjkwMTIzYTEuOTM5LDEuOTM5LDAsMCwxLS4yNDA4MS0uMDAyOWMtLjA0ODgxLS4wMTQ3Mi0uMDk3NjItLjAyOTQ0LS4xNTYzOS0uMDQ1MTFMNTAwLjI0NTM1LDMxMC4yNjUxbC0uMzQ5OC0uMTIzOGEuNjcwMjUuNjcwMjUsMCwwLDEtLjIxOTQyLS4xMjE0NkEuOTEwMTYuOTEwMTYsMCwwLDEsNDk5LjM1MjE2LDMwOC45OTQzOVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMzZjNkNTYiLz48cGF0aCBkPSJNNTg4LjkxOTA1LDQ0Mi45NzQ1NmEuODkzNzYuODkzNzYsMCwwLDEtLjc0MjUxLTEuMDE1NzRsMTQuNTE2ODctOTYuMzM0MTRhLjg5NC44OTQsMCwwLDEsMS4wMTctLjc1MDU2bC4wMDguMDAxMjlhLjg5Mzc3Ljg5Mzc3LDAsMCwxLC43NDI1MiwxLjAxNTc0bC0xNC41MTY4Nyw5Ni4zMzQxNGEuODk0Ljg5NCwwLDAsMS0xLjAxNy43NTA1NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMzZjNkNTYiLz48cGF0aCBkPSJNNjI1LjcxNiw0MzYuODYzNDJsLTkuNjU0OCwxLjAxODg4LDExLjI5MzM3LTk1LjUzNDdzMTIuODk0NTgtMi4zMzQ2NCwxMy4yMzk1MS0xLjM5ODQ2QzY0MC44MDYzMSwzNDEuNTA4MDgsNjI1LjgwODA1LDQzNi4yNTA2Niw2MjUuNzE2LDQzNi44NjM0MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMzZjNkNTYiLz48cG9seWdvbiBwb2ludHM9IjMzMS4yNSAxODIuNTMzIDMzMC45OSAyMjYuMSA0MDguMTE2IDI1NS40ODggNDM1LjgxMyAyMTguMjg0IDMzMS4yNSAxODIuNTMzIiBmaWxsPSIjM2YzZDU2Ii8+PHBhdGggZD0iTTY3MS4xMzE0NCwzMzcuNzI0NjVhNS4zMDEwNSw1LjMwMTA1LDAsMCwwLTIuNDk2ODgtMS43MzY1NGwtOTguNDA1OTQtMzIuNzc3N2E1LjEwNTgyLDUuMTA1ODIsMCwwLDAtLjg0OC0uMjA2NjUsNS4wMDg5NCw1LjAwODk0LDAsMCwwLS45NTA2NS0uMDcxMTVsLjE1OTY2LS45OTczMS45ODUxMS0uNzEzMjMsMjMuMzY4MjItMTYuOTE4OCw3OC4wNDA1MywyMy45MTcwNS4xMzU0OSwyNy4wNTE1NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMzZjNkNTYiLz48cGF0aCBkPSJNNTAzLjgyOSwzODAuMDc5NjNhMS41MTMyNiwxLjUxMzI2LDAsMCwxLC4zMjYuMDY4NDNsMzAuMTkzNjUsOS45MTY4NmExLjUwMDE0LDEuNTAwMTQsMCwwLDEtLjkzNTU1LDIuODUwNjlsLTMwLjE5MzY0LTkuOTE2ODVhMS41MDAzOSwxLjUwMDM5LDAsMCwxLC42MDk1Mi0yLjkxOTEzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjQ1Ny4wMDMyMiIgY3k9IjQyMy4yMzU5MyIgcj0iMTIiIGZpbGw9IiNmMmYyZjIiLz48Y2lyY2xlIGN4PSIxNTEuMDAzMjIiIGN5PSI0NjcuMjM1OTMiIHI9IjEyIiBmaWxsPSIjZjJmMmYyIi8+PGNpcmNsZSBjeD0iNDAxLjAwMzIyIiBjeT0iNzAuMjM1OTMiIHI9IjEyIiBmaWxsPSIjZjJmMmYyIi8+PHBhdGggZD0iTTU4OS4zNDAyNCwzOTcuNzI4NTJBMTEuNTk5NDcsMTEuNTk5NDcsMCwwLDEsNTczLjQzMywzODkuNzcxNEw1MzIuNDIxLDM4NS42Mjc5MmwxMy41MzAyMi0xNi42MDYyOCwzNi44NzEyOCw2LjQ4MDY1YTExLjY2MjM2LDExLjY2MjM2LDAsMCwxLDYuNTE3NywyMi4yMjYyM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZmI4YjgiLz48cGF0aCBkPSJNNTY0LjExNSwzOTEuMTQwODJsLTk1LjcwODQ5LTguODE4MzYtLjEzMTM1LS4xNTA4OEwzOTguNDI0NTUsMzAyLjEzNWEzMi45NTk2NywzMi45NTk2NywwLDAsMSw4LjAxMzE5LTQ0LjUyMzQ0aDBhMzIuOTI0MjUsMzIuOTI0MjUsMCwwLDEsNDguMTQzNTUsMTAuMjA5bDQzLjAyMjQ2LDc1LjU0NDQzLDY3LjU2NTQzLDI3LjE0N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNlNmU2ZTYiLz48cGF0aCBkPSJNODA0LjMzODU5LDIzNy4yMjM3NmMtMi4zNzY4OC0xNy40MzM4Ny01LjM1Nzg4LTM2LjE1MTcyLTE3LjY1NDExLTQ4LjczNjlhNDEuMzQ5OTIsNDEuMzQ5OTIsMCwwLDAtNTkuNzQzODQuNjE4MzdjLTguOTUwNzksOS41NDg3Ni0xMi45MDM2NSwyMi45NTY3Mi0xMy4yNjU0LDM2LjAzOTgzczIuNTUyMDUsMjYuMDIwODEsNS43ODQ0MiwzOC43MDM0N2ExMTkuMjg5NTgsMTE5LjI4OTU4LDAsMCwwLDQ5Ljc4NTc3LTkuNzk5MzdjMy45MjYxNy0xLjcwNDA3LDcuNzg5LTMuNjMwNTYsMTEuOTM2ODktNC42ODYzNCw0LjE0Nzg0LTEuMDU1NzEsNy4xMDQ1NCwxLjYwMDg4LDEwLjk2MjkyLDMuNDUzMzVsMi4xMTgtNC4wNTU0NWMxLjczMzc3LDMuMjI2NTksNy4xMDI0NCwyLjI3MDE3LDkuMDQ5NzgtLjgzMjI0QzgwNS4yNjAwNywyNDQuODI2MDgsODA0LjgzMzUyLDI0MC44NTMsODA0LjMzODU5LDIzNy4yMjM3NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMyZjJlNDEiLz48cGF0aCBkPSJNNzM2LjUzMiwzMzQuNTMyNDRsLTY5Ljg3NiwxLjQ5NDQxYTExLjA1NDU1LDExLjA1NDU1LDAsMSwwLTQuOTM5NzQsMTUuNTczODNjOS4yNjc2MS41MjY3NCw4MS43NzE5MSwxMC44MTczMyw4Ni4wOTc0LDQuMTg1NDksNC4zOTAyNy02LjczMTA2LDI3LjgyNDIzLTMwLjQ4NjEyLDI3LjgyNDIzLTMwLjQ4NjEybC0xOC4wMTI3MS0yNS42NDM3OFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiM5ZTYxNmEiLz48Y2lyY2xlIGN4PSI1ODQuOTEwOTYiIGN5PSI5NC4wMzUyNSIgcj0iMzIuODMwMTIiIGZpbGw9IiM5ZTYxNmEiLz48cGF0aCBkPSJNNTk5LjM2MTQ3LDI5OS4xODQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiNmZTYzNGUiLz48cGF0aCBkPSJNODA2LjE0MTk1LDI4NC44MTA3NWMtMy44Njg4OC03LjY5OTgxLTUuNzQ4NzMtMTcuMjEyLTEzLjk5NjcxLTE5LjcwODIzLTUuNTY5NjUtMS42ODU2My0yOC4wOTY5MS44NDA0OC0zMy4xNzMxMiwzLjY4NTktOC40NDM1Niw0LjczMzEzLS43OTE4OSwxMy42MDIzNC01Ljc3MzMyLDIxLjkwMjE0LTUuNDE1MTcsOS4wMjI3MS0yMC4xMzIsMjcuMTI5NzgtMjUuNTQ3MiwzNi4xNTI0MS0zLjcyMjc5LDYuMjAyNzksOC44MTcxLDI0LjQwOTQ3LDYuODA0MDgsMzEuMzU4LTIuMDEyNzMsNi45NDg0OC0yLjEwOTYyLDE0Ljc0NzM2LDEuMzE5NTIsMjEuMTE3MjIsMy4wNjg4OCw1LjcwMTQxLTEuMzcxMzcsMTAuNzQ1LDEuNzE1MjEsMTYuNDM3LDMuMjA5NTcsNS45MTk2Miw3LjE0ODQ5LDI4LjA1Mjc0LDQuMTYxMTksMzQuMDg3ODVsLTIsNmMxOS44NDY4MiwxLjE2NjA5LDM2LjUzNDU5LTIyLjU0NDI3LDU2LjI1ODEzLTI1LjA0MTg4LDQuODk4OTQtLjYyMDMyLDkuOTg1NjUtMS40MzA3MywxNC4wMjI1MS00LjI3NDM1LDUuOTQ2MzktNC4xODg2NCw4LjI5NzE3LTExLjc4OTIzLDkuNzY2MzgtMTguOTEyODJBMTU5LjMyNTc2LDE1OS4zMjU3NiwwLDAsMCw4MDYuMTQxOTUsMjg0LjgxMDc1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC42NDgzOCAtMTI3LjYwNzA0KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik04MzUuODk3OTMsMzY2LjExMjQ1Yy0yLjc2NDQzLTcuNTQ1NjMtNy43NjktNDAuNTM2Ni03Ljc2OS00MC41MzY2bC0zMS4zMjQxNy0uOTE4NDgsMTUuMzE0NDMsMzcuNzcyLTQxLjc5MDM2LDU4LjUwMjgzcy4wNzczOS4xMjg1My4yMTgwOC4zNTc3OGExMS4wNTIsMTEuMDUyLDAsMSwwLDkuMjY5NjQsMTEuNzQ0ODMuNzYzMDUuNzYzMDUsMCwwLDAsLjk1ODA3LS4xNjQ0NUM3ODUuNDI0NjUsNDI3LjAzNSw4MzguNjYyMzYsMzczLjY1ODE1LDgzNS44OTc5MywzNjYuMTEyNDVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4LjY0ODM4IC0xMjcuNjA3MDQpIiBmaWxsPSIjOWU2MTZhIi8+PHBhdGggZD0iTTgzOS4wODI2LDM0NS4yNzc0MWMtMi44NzUxMS0xMi4xMzQ3OC01Ljc3MTUyLTI0LjMzNTQ5LTEwLjYxODg3LTM1LjgyNTY2cy0xMS43ODY2MS0yMi4zNDI4Ni0yMS41NDY2OS0zMC4xMDU0M2MtMy4xMjA0OC0yLjQ4MTc5LTYuNjA5LTQuNjcyMzItMTAuNTIwNzgtNS40NDM4OS0zLjkxMTQ3LS43NzE2NS04LjMxOTY3LjA5MTkzLTExLjA2NjcsMi45ODEzNy00LjM5NjIxLDQuNjIzNTctMy4wNzMzOSwxMi4wNDUxLTEuNDYxMSwxOC4yMTc4MVE3OTEsMzIyLjQwMjI0LDc5OC4xMzEyMywzNDkuNzAyODZxMjAuNTk0MTgtMi4xODI4Nyw0MS4xODgtNC4zNjU5MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMzZjNkNTYiLz48cGF0aCBkPSJNNzkzLjc4NzEsMjI2LjE5NTkyYy0xLjIwOTA4LTcuOTQyLTIuNDcxODgtMTUuOTUwNDMtNS4zMTIyOC0yMy40Mjg1Ny0yLjg0MDQtNy40NzgyMS03LjQxODgyLTE0LjQ4MjQ5LTEzLjk4NjQ3LTE4LjcxODgyLTEwLjM5ODc5LTYuNzA3MDktMjMuODYyLTUuNDEzNTItMzUuNTIwNzQtMS41NTU0NC05LjAxNjIyLDIuOTgzNy0xNy44MTc2MSw3LjUxODY0LTI0LjE3NTc0LDE0LjgwOTMtNi4zNTg0OCw3LjI5MDc0LTkuOTI5NTcsMTcuNjkzNzktNy41NjQzOSwyNy4yMjY2NXExOC42NTQ2NC00LjQwNzM4LDM3LjMwODkzLTguODE0ODNsLTEuMzYxMzcuOTYyYTMwLjAzNzY1LDMwLjAzNzY1LDAsMCwxLDE2LjAzMDgzLDIwLjg5MjcsMzEuMTIyMDksMzEuMTIyMDksMCwwLDEtNi41NjU1NCwyNS44NDc3M3ExMi43MjI0NC00LjUxMzIzLDI1LjQ0NDg5LTkuMDI2M2M1LjIzNTI2LTEuODU3MTMsMTAuODM4MzMtMy45OTcsMTMuOTQyNjctOC43NjA0N0M3OTUuNjI3MjMsMjQwLjEwNyw3OTQuNzkwOTEsMjMyLjc4Njg1LDc5My43ODcxLDIyNi4xOTU5MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjguNjQ4MzggLTEyNy42MDcwNCkiIGZpbGw9IiMyZjJlNDEiLz48L3N2Zz4=" />
            }
          />
      }
    </Fragment>
  );
}

export default StaffList;
