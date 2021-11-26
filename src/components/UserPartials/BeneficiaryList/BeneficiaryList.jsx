import { Fragment, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRecoilValue, useRecoilState } from 'recoil';
import { withBeneficiaryQuery, userBeneficiariesAtom } from '../../../recoil/userBeneficiaries';
import { object, string } from 'yup';
import _, { isEmpty } from 'lodash';
import { ThreeDots } from 'react-loading-icons';
import NoEntity from '../../NoEntity';
import { catchAxiosErrors, getToken, transformToFormData } from '../../../utils';
import { postRequest } from '../../../utils/axiosClient';
import { toast } from 'react-toastify';
import { TiEdit } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { TextField } from '../../FormField';
import './BeneficiaryList.css';
import 'animate.css';


const initialFormValues = (data) => {
  return {
    name: data?.name,
    email: data?.email,
    phone: data?.phone
  }
}

const updateBeneficiarySchema = object().shape({
  name: string()
    .min(4, 'Too Short')
    .max(70, 'Too Long')
    .required('Required'),
  email: string()
    .email('Invalid Email')
    .required('Required'),
  phone: string()
    .required('Required'),
});

export const BeneficiaryModalFooter = ({ values, isValid, errors, modalId, beneficiary }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useRecoilState(userBeneficiariesAtom);

  useEffect(() => {
    console.log(values, isValid);
  }, [values]);

  const updateState = (bId) => {
    const index = _.findIndex(beneficiaries, (o) => o.id === bId);
    const benefData = beneficiaries[index];

    if (index === -1) {
      console.log('no match');
    } else {
      setBeneficiaries([
        ...beneficiaries.slice(0, index),
        benefData,
        ...beneficiaries.slice(index+1)
      ]);
    }
  }

  const updateBeneficiary = async (beneficiaryId) => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await postRequest(`/park_user/update-beneficary/${beneficiaryId}`, transformToFormData(values), {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        toast.success(`Updated Successfully!`);
        updateState(beneficiaryId);
        setIsLoading(false);
        setTimeout(() => {
          document.getElementById(`${modalId}`).click();
        }, 100);
      }
    } catch(err) {
      catchAxiosErrors(err, setIsLoading, null);
    }
  }

  return (
    <Fragment>
      <div className="mt-3 d-flex justify-content-end align-items-center">
          <button id="close_update_benef_modal" type="button" className="btn btn-danger light mr-3" data-dismiss="modal">Close</button>
          { isLoading
            ? <ThreeDots className="ml-3 animate__animated animate__pulse" height="1.5em" width="3.5em" stroke="#fe634e" /> 
            : <button onClick={() => updateBeneficiary(_.get(beneficiary, 'id', null))} type="button" disabled={(isEmpty(errors) && isValid) ? false : true} className="btn btn-primary animate__animated animate__pulse">Update</button>
          }
        </div>
    </Fragment>
  );
}

export const BeneficiaryTableActions = ({ uid, loaderId, beneficiaryData }) => {
  
  const [isLoading, setIsLoading] = useState();
  const [beneficiary, setBeneficiary] = useRecoilState(userBeneficiariesAtom);

  console.log('Beneficiary', beneficiary);

  const removeBeneficiary = async (beneficiaryId) => {
    try {
      setIsLoading(true);
      const { data, status, statusText } = await  postRequest(`/park_user/delete-beneficary/${beneficiaryId}`, null, {
        headers: { authorization: `Bearer ${await getToken()}` }
      });

      if (data) {
        console.log(data, status, statusText);
        setBeneficiary(beneficiary.filter(benef => benef.id !== beneficiaryId));
        toast.success(`Deleted Successfully!`);
        setIsLoading(false);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading, null);
    }
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center">
        <span data-toggle="modal" data-target={`#exampleUpdateBeneficiaryModal${uid}`} id={`${uid}${loaderId}`} className="pointer pointer-scale mr-4">
          <i><TiEdit className="text-secondary" size={"25px"} /></i>
        </span>

        {/* Update Modal */}
        <div className="modal fade" id={`exampleUpdateBeneficiaryModal${uid}`}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Beneficiary</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <AiOutlineCloseCircle />
                </button>
              </div>

              <div className="modal-body text-left">
                <Formik
                  initialValues={initialFormValues(beneficiaryData)}
                  validationSchema={updateBeneficiarySchema}
                >
                  {props => (
                    <Form>
                      <div className="row">
                        <div className="col-sm-12 mb-3">
                          <label htmlFor="name" className="text-label fs-6 m-0">Beneficiary's Name</label>
                          <Field name="name" as={TextField} placeholder="e.g John Snow" />
                          <ErrorMessage name="name">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 mb-3">
                          <label htmlFor="email" className="text-label fs-6 m-0">Beneficiary's Email</label>
                          <Field name="email" as={TextField} placeholder="e.g snow@example.com" />
                          <ErrorMessage name="email">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="col-sm-12 mb-3">
                          <label htmlFor="phone" className="text-label fs-6 m-0">Beneficiary's Phone Number</label>
                          <Field name="phone" as={TextField} placeholder="e.g 09012345678" />
                          <ErrorMessage name="phone">
                            {msg => <div className="error-msg text-warning">{msg}</div>}
                          </ErrorMessage>
                        </div>

                      </div>

                      <BeneficiaryModalFooter 
                        values={props.values}
                        isValid={props.isValid}
                        errors={props.errors}
                        beneficiary={beneficiaryData}
                        modalId={`exampleUpdateBeneficiaryModal${uid}`}
                      />
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        {/* Update Modal */}

        {isLoading
          ? <span id={loaderId} className="mr-4">
              <ThreeDots className="animate__animated animate__pulse" height={"1rem"} width={"1.8rem"} />
            </span>
          : <span onClick={() => removeBeneficiary(_.get(beneficiaryData, 'id', null))} className="pointer pointer-scale mr-4">
              <i><RiDeleteBin6Line className="text-primary" size={"25px"} /></i>
            </span>
        }
      </div>
    </Fragment>
  );
}



const BeneficiaryList = () => {

  const beneficiaryArray = useRecoilValue(withBeneficiaryQuery);
  console.log('Beneficiary:', beneficiaryArray);

  return (
    <Fragment>
      {(!isEmpty(beneficiaryArray))
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
                      <th><strong className="text-muted">Name</strong></th>
                      <th><strong className="text-muted">Email</strong></th>
                      <th><strong className="text-muted">Phone Number</strong></th>
                      <th><strong className="text-muted">Actions</strong></th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiaryArray.map((beneficiary, index) => (
                      <tr>
                        <td>
                          <div className="checkbox mr-0 align-self-center">
                            <div className="custom-control custom-checkbox ">
                              <input type="checkbox" className="custom-control-input" id="checkAll" required />
                              <label className="custom-control-label" htmlFor="checkAll" />
                            </div>
                          </div>
                        </td>
                        <td>{index+=1}</td>
                        <td>{_.get(beneficiary, 'name', null)}</td>
                        <td>{_.get(beneficiary, 'email', null)}</td>
                        <td>{_.get(beneficiary, 'phone', null)}</td>
                        <td>
                          <BeneficiaryTableActions 
                            uid={`action${_.get(beneficiary, 'id', null)}`}
                            loaderId={`btn${index}${_.get(beneficiary, 'id', null)}`}
                            beneficiaryData={beneficiary}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        : <NoEntity 
            title={"No Beneficiaries At This Time"} 
            copy={"Goto the beneficiaries page in other to add new beneficiaries."}
            imgUrl={
              <img alt="" src="data:image/svg+xml;base64,PHN2ZyBpZD0iYTRmMzI5MDktYTAzNS00OTBmLWJjNzItZjNhY2MzM2VmMGYxIiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9Ijc4Ni4yOTQ2OCIgaGVpZ2h0PSI3NDkuMTk3MSIgdmlld0JveD0iMCAwIDc4Ni4yOTQ2OCA3NDkuMTk3MSI+PHRpdGxlPmZyaWVuZHM8L3RpdGxlPjxlbGxpcHNlIGN4PSI0MjguMjk0NjgiIGN5PSI2NzAuODkwMjQiIHJ4PSIzNTgiIHJ5PSI0MCIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik04MTIuNjk0NDUsNzAyLjAzMTFsNi4xNzQxMSwxOS4wMjMxNXMyOS43MzYsMzAuNzIwNzksMTguOTgxMjgsMzkuMDQ3NTUtMzQuODg0LTM1LjU2ODM3LTM0Ljg4NC0zNS41NjgzN2wtNC40NDctMjEuNDc2MTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIGZpbGw9IiNmZmI4YjgiLz48cGF0aCBkPSJNNzU1LjY0NzM0LDU1NC43OTE2OWw5LTNzMTQsNCwxNiwxOCwxNyw4NSwxNyw4NSw2LDMsMiw4LDIwLDUwLDIwLDUwbC0xOSw5cy0zOC00MC0zOC00NCwxLTgsMS0xMi0xLTQsMC03YTMyLjE2NjY5LDMyLjE2NjY5LDAsMCwwLDEtOGwtNy0xNloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgZmlsbD0iI2Y5YTgyNiIvPjxlbGxpcHNlIGN4PSI5MC40MTc3NyIgY3k9IjM2My40OTc2OCIgcng9IjkwLjQxNzc3IiByeT0iMTg0LjQ4ODc3IiBmaWxsPSIjZjlhODI2Ii8+PHBhdGggZD0iTTI5Ni40NDAzMSw0NDAuODEyNjhjNC41MTAyNS04MC4zMDY2NCwxMy41OTc2NS0xMzQuNTUxMjcsMTMuNjg5LTEzNS4wODk4NGwtMS45NzE2OC0uMzM0Yy0uMDkxMzEuNTM5MDctOS4xOTQ4Miw1NC44NzA2MS0xMy43MTI0LDEzNS4yODA3Ny00LjE2ODk0LDc0LjIxMzg2LTUuMTc0OCwxODYuNDY2NzksMTMuNzExOTIsMjk5Ljc4NjEzbDEuOTcyNjUtLjMyODEzQzI5MS4yNzUyNyw2MjcuMDAwNjcsMjkyLjI3ODY5LDUxNC45MTc2NiwyOTYuNDQwMzEsNDQwLjgxMjY4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNi44NTI2NiAtNzUuNDAxNDUpIiBmaWxsPSIjM2YzZDU2Ii8+PHJlY3QgeD0iMjkxLjMxNjQ5IiB5PSI0MjMuMjQ0NzUiIHdpZHRoPSI5Mi43MjUxNyIgaGVpZ2h0PSIyLjAwMDEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzY3LjA4NzE2IDEzNC4xNTA4KSByb3RhdGUoLTI4LjE1NjkpIiBmaWxsPSIjM2YzZDU2Ii8+PHJlY3QgeD0iMjUwLjM4MTY2IiB5PSIzOTkuODAxNjYiIHdpZHRoPSIyLjAwMDEyIiBoZWlnaHQ9IjkyLjcyNTE3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDY3LjQ1NjQ4IDM4MS45OTI5Nikgcm90YXRlKC02MS44NTg0KSIgZmlsbD0iIzNmM2Q1NiIvPjxlbGxpcHNlIGN4PSIzMDQuNTY1MTEiIGN5PSIyNTIuNDU4MzIiIHJ4PSIxMjMuNzI5NTciIHJ5PSIyNTIuNDU4MzIiIGZpbGw9IiNlNmU2ZTYiLz48cGF0aCBkPSJNNTA5LjkxNDkyLDMzMC40NDZjNi4xNzI4NS0xMDkuOTExMTMsMTguNjEwODQtMTg0LjE1MTg1LDE4LjczNTg0LTE4NC44ODkxNmwtMS45NzE2OC0uMzM0Yy0uMTI1LjczNzc5LTEyLjU3OTEsNzUuMDY1NDMtMTguNzU5MjgsMTg1LjA4MDA4LTUuNzA0NTksMTAxLjUzNzU5LTcuMDgwNTcsMjU1LjExNzY3LDE4Ljc1ODc5LDQxMC4xNTI4M2wxLjk3MjY2LS4zMjgxM0M1MDIuODQ0MTIsNTg1LjI4Mzg3LDUwNC4yMTgxNCw0MzEuODc0NjksNTA5LjkxNDkyLDMzMC40NDZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIGZpbGw9IiMzZjNkNTYiLz48cmVjdCB4PSI1MDMuMjcwMDkiIHk9IjMwNi44MDYyOCIgd2lkdGg9IjEyNi44ODczMiIgaGVpZ2h0PSIyLjAwMDEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjg1LjAzNzA0IDIyOC40NTIyNSkgcm90YXRlKC0yOC4xNTcxKSIgZmlsbD0iIzNmM2Q1NiIvPjxyZWN0IHg9IjQ0Ny42MjI4NyIgeT0iMjc0LjM1Nzc5IiB3aWR0aD0iMi4wMDAxMiIgaGVpZ2h0PSIxMjYuODg3MzIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjcuNjkxODggNDk4LjY2Mzk5KSByb3RhdGUoLTYxLjg1ODQpIiBmaWxsPSIjM2YzZDU2Ii8+PGVsbGlwc2UgY3g9IjIwMS40OTE0NiIgY3k9IjUwOC45NjgxNyIgcng9IjQ2LjIyODYzIiByeT0iOTQuMzI1MDkiIGZpbGw9IiNlNmU2ZTYiLz48cGF0aCBkPSJNNDA4LjMwMzQxLDU4OC40MzM0MWwuMjczNjIuNTExNiw0MS43OTc4NS0yMi4zNzIwNy0uOTQzMzYtMS43NjM2OC00MS4wNDEsMjEuOTY3YzIuMjcxMTItNDEuODAxMzksNi45MTYxNC02OS44NjI2Nyw3LjAwOTc3LTcwLjQxNTIybC0xLjk3MTY4LS4zMzRjLS4xMDIyMy42MDMzOS01LjYyMTIyLDMzLjkyNjUxLTcuNTgwMTQsODIuMTQ0OUwzNjQuNDU1LDU3Ni4wMTYzLDM2My41MTE2LDU3Ny43OCw0MDUuMzA5NDUsNjAwLjE1MmwuNDk5LS45MzI4Yy0xLjU2NzMyLDM5Ljc5NzM2LS42ODg4NCw4OS41NTk2Myw3LjYxOTY5LDEzOS40MTAzNGwxLjk3MjY2LS4zMjgxM0M0MDYuMzQyMSw2ODMuOTQ5LDQwNi4xNDI1OCw2MjkuNjk4NjcsNDA4LjMwMzQxLDU4OC40MzM0MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik03NjcuODgzOCw0NTkuODY1NjVjLTE2LjA3NDE3LTI3LjM5NTQzLTQ3Ljg3NTY1LTI4LjY3MjE4LTQ3Ljg3NTY1LTI4LjY3MjE4cy0zMC45ODg3Mi0zLjk5NzEtNTAuODY3NzksMzcuNzI2NDdjLTE4LjUyODg4LDM4Ljg4OTgxLTQ0LjEwMTEsNzYuNDM4Ny00LjExNjkyLDg1LjU0MjUybDcuMjIyMy0yMi42NzM1Nyw0LjQ3Mjc0LDI0LjM2MTZhMTU1LjExMDUsMTU1LjExMDUsMCwwLDAsMTcuMTA3NzQuMjk0OTFjNDIuODE5ODMtMS4zOTQ0NCw4My41OTkyNC40MDgsODIuMjg2Mi0xNS4wOTA1NUM3NzQuMzY3LDUyMC43NTE3NSw3ODMuMzUwMzksNDg2LjIyNTUzLDc2Ny44ODM4LDQ1OS44NjU2NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgZmlsbD0iIzJmMmU0MSIvPjxwYXRoIGQ9Ik02NTUuODQyMTMsNjc5LjMwMDUxYTYxLjIzOTU1LDYxLjIzOTU1LDAsMCwxLTEuOTQ5MjEsOC40NjM1Yy0uOTU2MTcsMi43MTItMi40MzI0LDUuMjIwMDYtMy4zMDY2Nyw3Ljk2LTIuNzg2NzgsOC43MzM3OSwxLjA3NjUyLDE4LjQ3MTc1LDcuMjQ2ODIsMjUuMjEzMTFhNDAuNzIyLDQwLjcyMiwwLDAsMCwxOS44ODc0MywxMS45MTEzOWM1LjU2NjQxLDEuNDEyMDksMTEuMzU0MTcsMS42MTUzMiwxNy4wOTA2NCwxLjgxMTUzLDE1Ljg4NDU5LjU0MzMxLDMyLjE3Nzg4LDEuMDI5MzgsNDcuMjI5NDctNC4xMTk2OWE4MS43MTk5LDgxLjcxOTksMCwwLDAsMTMuNzIxNTktNi4yODc1NiwxMC4yODc1LDEwLjI4NzUsMCwwLDAsMy41NjA0NS0yLjgyNzcxYzEuMTQ4LTEuNjQ4NTEsMS4yOTQ4NS0zLjc4NjQ4LDEuMjg0ODMtNS44MDEtLjAzMzc4LTYuNzkyMTctMS4zOTg5NC0xMy41NDk3LTEuMDc0ODEtMjAuMzM0MDguMTc5NTMtMy43NTc4Ni44NzY3OS03LjUxMjgyLjUzMzU3LTExLjI1OTA4YTIwLjcxMDE5LDIwLjcxMDE5LDAsMCwwLTE1LjczNzc2LTE3Ljg5MTg2Yy00LjI2OTgtLjkyNDg0LTguNjk4NDYtLjQyMDg5LTEzLjA0NTU1LjAwMDcxYTMyOS43ODkyMiwzMjkuNzg5MjIsMCwwLDEtMzMuOTUxNDgsMS41MzEyM2MtMTEuNTgyMTItLjA3NDU3LTIzLjA5MjcyLTEuODU3ODYtMzQuNjE3MTktMi4wNDQxMS0zLjQwODEyLS4wNTUwNy0zLjMzOTI3LDEuMDA0NzEtNC40MjQyOSw0LjMzMTY5QTgxLjYwNDg2LDgxLjYwNDg2LDAsMCwwLDY1NS44NDIxMyw2NzkuMzAwNTFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIGZpbGw9IiMyZjJlNDEiLz48cGF0aCBkPSJNNjEwLjU1MTgsNjczLjc4MDIyYTMzLjk4OTI5LDMzLjk4OTI5LDAsMCwwLTkuNTMzLTEuMDIyMTgsMjQuMDYwMzgsMjQuMDYwMzgsMCwwLDAtMTcuMzc5LDkuMTEzODYsMjQuNDkxMzUsMjQuNDkxMzUsMCwwLDAtNC43MTA1MywxOS4xNzcyMSw0MC41MzI2MSw0MC41MzI2MSwwLDAsMCwzLjc3NzQ5LDEwLjQxMTY3YzIuNTI4MTgsNS4xNzUwNiw1LjU2MDM4LDEwLjMzODI0LDEwLjI0MDcsMTMuNjU0NTRhMzkuNzM2ODgsMzkuNzM2ODgsMCwwLDAsOS4wMzc3LDQuMzM5MjNsMjQuNjUwMyw5LjM2NjU2YzMuNjI2MzQsMS4zNzc5Myw3LjI1MzIyLDIuNzU2MDYsMTAuOTE1NDUsNC4wMzM3NWEyMTEuODk5NDksMjExLjg5OTQ5LDAsMCwwLDU3LjAxMjc2LDExLjQzMjMzYzUuOTE5LjM1NTUyLDExLjkyNzU3LjQ1NDQ0LDE3LjcwMTg4LS45MDQ3NGE1Ljc0OSw1Ljc0OSwwLDAsMCwzLjYyNTMyLTEuOTc1NTUsNi4zMDE3OCw2LjMwMTc4LDAsMCwwLC44MS0yLjY5ODU4bDEuNTE2ODUtMTAuNzEwOGE5LjA0NjY5LDkuMDQ2NjksMCwwLDAtLjEyODkzLTQuNTE1MjFjLS42OTQ4Ni0xLjgwMDA5LTIuNDM2NjEtMi45MzI0Ny00LjA5NzMzLTMuODk0NTUtMTYuMjA1ODMtOS4zODgzOC0zNS4xMjgwOC0xNC41Njc4OC00OC43Njg3Ni0yNy40NTMyNy0zLjIxMTI0LTMuMDMzNDMtNS44OTg1My03Ljg0MTcyLTkuODAwMTUtOS45MDIyNy00LjQyNDM4LTIuMzM2NjMtOS42MzQ5My0zLjY3MDIzLTE0LjIwODE0LTUuODIzNDFDNjMxLjIxNjg0LDY4MS43MDE3MSw2MjEuMzg3MjcsNjc2LjI5MjUzLDYxMC41NTE4LDY3My43ODAyMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgZmlsbD0iIzJmMmU0MSIvPjxwYXRoIGQ9Ik02MzUuMTYxNTUsNjg4LjIxOTkyYzguNzEyODQsMi43NTM3OSw0NS40OTg1LDIxLjgzMjA2LDUxLjgwMzY3LDI4LjQ5MzE3LS44NDUxNS4zMDcxNC0yOS41MjAyNC0xNS45MDE4OC0zMC4zODA2Ni0xNi4xNjIzNS03LjgyMTMtMi4zNjc2NS0xNS42ODYwOC00Ljc1MDg0LTIzLjExMzU2LTguMjE1OC0xLjQ5NDIxLS42OTctOS43MDcyNS0zLjk3MzM5LTkuMzM1My01Ljg3NUM2MjQuNTU1NDEsNjg0LjMxNDE0LDYzMy42MTQ3OCw2ODcuNzMxMDUsNjM1LjE2MTU1LDY4OC4yMTk5MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgb3BhY2l0eT0iMC4xIi8+PHBhdGggZD0iTTc0My44NTk3OCw3NTkuODQyMTJhMi4wMzQzLDIuMDM0MywwLDAsMCwxLjM4MTItLjQxLDIuMTY1MywyLjE2NTMsMCwwLDAsLjQzMTczLTEuNjAzMTdsLS4wNDA1OS0xNC41OTE5MWMtNC4xNjAwNy0xLjk5OTIyLTguODEzNDEtMi42NC0xMy4zODA5MS0zLjI1NTg0TDcxMC45NCw3MzcuMTA4Yy40ODk2My4wNjYtMy4zMzIxMyw5LjI1ODM1LTIuNzQ2MTQsMTAuNDg1NTYsMS4wMzI4MiwyLjE2Myw4LjkyNTgzLDQuMDc5OTMsMTEuMTUzNDIsNS4xMDExOUM3MjcuMDkxMTUsNzU2LjI0NSw3MzUuMTM4MDcsNzYwLjE0OCw3NDMuODU5NzgsNzU5Ljg0MjEyWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNi44NTI2NiAtNzUuNDAxNDUpIiBmaWxsPSIjZmZiOGI4Ii8+PHBhdGggZD0iTTY3Ni45OTYxLDc0My4xODY1NGMtNC4wMjM3NS42NDY0NC04LjUxNDc4LDEuMjE3ODYtMTEuMTIwNjIsNC4zNzcyLTMuMzA0NTYsNC4wMDY0Ny0xLjg5Nzc4LDkuOTc5MTEtLjMyMTQsMTQuOTQyMzNhNi40NTQ0Nyw2LjQ1NDQ3LDAsMCwwLDEuMzcwNzQsMi43MTg5NGMxLjA3NTgsMS4wNzA1LDIuNzI0MzgsMS4yMjczMyw0LjIzMjU2LDEuMzIzNjYsMy42Njk2LjIzNDM4LDcuNTc0OC40MTgsMTAuNzgxMDctMS4zOTc1NGE0Ny4yODQ0Myw0Ny4yODQ0MywwLDAsMCw0LjE4OC0zLjEzOTkzLDI2Ljc0Mjg4LDI2Ljc0Mjg4LDAsMCwxLDcuNy0zLjU1MDc5LDc3LjI3OTA5LDc3LjI3OTA5LDAsMCwxLDE1LjQ1NjQxLTMuMjEyODcsMjMuODUzLDIzLjg1MywwLDAsMCw2LjA4ODkxLTEuMDgyNjIsNi43NzQxNyw2Ljc3NDE3LDAsMCwwLDQuMjg4MDYtNC4xOTkyNGMuNzQyNjgtMi42NTE3Ny0uNzg1My01LjM1NTM0LTIuMjUwNzQtNy42ODA5Mi0xLjgyNTUtMi44OTctMy43NTk0Ni01Ljk0NzMxLTYuNDgxMzctOC4wNzk5NC0zLjk3MDk0LTMuMTExMjYtNS45MzUyNC0uNzIyODgtOS45MzUyMSwxLjI2ODA4QTgzLjc3ODY3LDgzLjc3ODY3LDAsMCwxLDY3Ni45OTYxLDc0My4xODY1NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgZmlsbD0iI2ZmYjhiOCIvPjxwYXRoIGQ9Ik02NjYuNDgwODMsNzQ2Ljg0MjNsLTI1LjU0OTMzLTcuNjE2ODVhMzMuNTYxODMsMzMuNTYxODMsMCwwLDAtOS41MDc4MS0xLjg1ODM4Yy0zLjI0MDE3LjAwMjQzLTYuNjMwMTksMS4wNzQtOC43MzE1OSwzLjU2MTY4LTEuOTgxMTgsMi4zNDUzNS0yLjU0ODIzLDUuNTUwNzgtMy4wNDIxMyw4LjU5MTQ1bC0xLjA1NjUzLDYuNTA0NDZhMzIuOTQ1MzEsMzIuOTQ1MzEsMCwwLDAtLjU5MTU1LDkuOTg4NDRjLjQ4MzI2LDMuMzEzOSwyLjE2MDQ1LDYuNjI0Nyw1LjA3NTYyLDguMjI4OTMsMy41MzU1MywxLjk0NTYyLDcuODY4NzcuOTk1MzIsMTEuODE0NjMuMTgxNTFhMTI3LjU2Njg0LDEyNy41NjY4NCwwLDAsMSwyNC4yMTE3OS0yLjYxODgzYzMuMDU4MTItLjAzNjg5LDYuMjY1NzIuMDAxNzUsOC45NjgtMS40NDI4MywzLjIxMjE3LTEuNzE3MTcsNS4xMzM4OS01LjM0OCw1LjQ2NDMyLTguOTk5NzJDNjc0LjAzOSw3NTUuODA1ODksNjcyLjIwMjkyLDc0OC41NDgxOSw2NjYuNDgwODMsNzQ2Ljg0MjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIGZpbGw9IiMyZjJlNDEiLz48cGF0aCBkPSJNNzUzLjkwMjgzLDc0MC4yMDQ2OWMzLjMxMjA5LS41ODU1MSw2LjIzNTE5LTIuNDg0MTksOS40MDg4OC0zLjYwNDkyLDQuNDY3MTUtMS41Nzc0Nyw5LjMwODExLTEuNTc3NDUsMTQuMDQxMDgtMS41NiwxLjczNzQ3LjAwNjQsMy41ODc3LjA0NTY5LDUuMDM0LDEuMDE2ODksMi4wODQ4LDEuNCwyLjYxOTEyLDQuMjAxNTgsMi45NzM2MSw2LjcwMjM3bDIuMTM4NzksMTUuMDg4MzdjLjQwMjI5LDIuODM4LjgwMjE5LDUuNzUxODYuMTc0NzIsOC41NDhzLTIuNTE3LDUuNDkxNjYtNS4yNjc4LDYuMjEzYy0zLjM0MDkyLjg3NjA2LTYuNjE2MTItMS4yNzY1OS05Ljc3MDU5LTIuNjkwNjgtNy44ODQzMy0zLjUzNDQtMTcuMDQ5NDEtMi42MzEtMjUuMjcwMjUtNS4yNzI2OC0xLjUyNTYyLS40OTAyNC0zLjE1OTU3LTEuMjM5ODUtMy43ODItMi43Mjc4OGE2LjI1NzMxLDYuMjU3MzEsMCwwLDEtLjI5NDIzLTIuNjA3MzhjLjE0MDc4LTQuODQ5ODQtLjg3MzM0LTExLjQ3MjQuNTc0MjctMTYuMTA3NDhDNzQ1LjE2NTIzLDczOS4wMzM3Niw3NTAuMjA1NjksNzQwLjIwNDY5LDc1My45MDI4Myw3NDAuMjA0NjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIGZpbGw9IiMyZjJlNDEiLz48cGF0aCBkPSJNODA3Ljk3MDc3LDY2Ny43MDcxOEE0My45OTgwOSw0My45OTgwOSwwLDAsMSw4MjMuNiw2NjYuNjMwMTFjNC4xNzgzLjQ2NDMsOC40ODMyMiwxLjYzNywxMS41MzM4NCw0LjU1NDA1LDMuNzEzMDUsMy41NTA0NCw0LjkwNjA2LDkuMDQxMjksNS4wMDU1OSwxNC4yMDA5M2E0NC42MTQsNDQuNjE0LDAsMCwxLTkuNTYwNDksMjguMzM0NjQsMjUuNTg4LDI1LjU4OCwwLDAsMS01LjQ2NTkzLDUuMzA3MzYsMzUuODQ1NTgsMzUuODQ1NTgsMCwwLDEtNy4xMTE1MSwzLjQ1NjcxTDc2Mi43OTgxMyw3NDQuNDQ2Yy0xNC41MjI3OCw1Ljc3Nzc4LTI5LjA5NjgyLDExLjU3MjMtNDQuMjQ0ODYsMTUuMzgxMzFhMy40MzYzNCwzLjQzNjM0LDAsMCwxLTQuNjQtMS42OTY3OSwxMTUuNjY4NTgsMTE1LjY2ODU4LDAsMCwxLTEyLjA5OS0yMi4zMjM3OCwyLjAxNzcsMi4wMTc3LDAsMCwxLS4xNTU4OC0xLjY3MTksMS45ODQsMS45ODQsMCwwLDEsLjgxNS0uNjk5OTVsMzkuMDQ1NzUtMjIuNjI4NjRhMzkuNDcwNzcsMzkuNDcwNzcsMCwwLDAsNy45NDcyMy01LjUyMzE1LDE5Ljg5NywxOS44OTcsMCwwLDAsNC4wODAxNS01LjcyOTU2Yy44MDkzNS0xLjcwNTEyLjg4NDg1LTUuNzI5LDEuOTE4NjYtNi45ODkyOSwxLjAxMjItMS4yMzQsNC40NzQ3My0xLjMzMjQ2LDYuMDczOTEtMS44MTc4MWE1NC44MjEwNyw1NC44MjEwNywwLDAsMCw2LjYxMjM5LTIuNTIxMjFjOC43MzQyNC0zLjk0MTIzLDE2LjUxMi05LjY2NzY0LDI0Ljg4NDktMTQuMjgyNDFBNjMuNTQ3MTksNjMuNTQ3MTksMCwwLDEsODA3Ljk3MDc3LDY2Ny43MDcxOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgZmlsbD0iIzJmMmU0MSIvPjxwYXRoIGQ9Ik03ODUuODM1MzEsNjg0LjYwNjE3Yy02LjcwODE5LDUuMDgxOTItMTUuMzk0MTIsOS43NTMzNy0yMi4wNDI2NSwxNC45NjkyLTIuMjY5MDcsMS43ODAxMS00MC4wOTUwNiwyMy4yMzAzLTQwLjYyOTksMjYuMDc5MTUsNi4yMDI3MSwxLjA1NDE2LDQ1LjcxNDUyLTI2LjgyNjU2LDUxLjM2NzY4LTI5LjYwODYxczEwLjY2NDQ4LTYuNzA1MzMsMTUuNjMwMjgtMTAuNTk5NjZjMS4yNjU0OS0uOTkyNDQsNi42Mjg2My0zLjk3NTg3LDIuOTk1ODEtNS4wODQ2N0M3OTEuMTEsNjc5LjczNyw3ODcuMzQ2MTcsNjgzLjU5MDIxLDc4NS44MzUzMSw2ODQuNjA2MTdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIG9wYWNpdHk9IjAuMSIvPjxjaXJjbGUgY3g9IjUxMS43OTQ2OCIgY3k9IjQxNS4zOTAyNCIgcj0iMzgiIGZpbGw9IiNmZmI4YjgiLz48cGF0aCBkPSJNNzM0LjY0NzM0LDUyMi43OTE2OXMtNiwxNSw1LDIxLTM0LDU0LTM0LDU0bC0yMC01OHMxNy02LDE0LTIyWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNi44NTI2NiAtNzUuNDAxNDUpIiBmaWxsPSIjZmZiOGI4Ii8+PHBhdGggZD0iTTcwOS42NDczNCw1NjMuNzkxNjlsMjQuMjE4LTI2LjczNTc0LDMyLjc4MiwxNi43MzU3NC01LDExOC04LDlzLTM0LDMwLTg2LDVjMCwwLTE4LTE1LTE3LTM4cy0yLTI2LTItMjZsLTEtODEsNDkuMzcxMTEtOS42ODhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIGZpbGw9IiNmOWE4MjYiLz48cGF0aCBkPSJNNTk4LjYwMDIzLDY5MS4wMzExbC02LjE3NDExLDE5LjAyMzE1UzU2Mi42OTAwNiw3NDAuNzc1LDU3My40NDQ4NCw3NDkuMTAxOHMzNC44ODQtMzUuNTY4MzcsMzQuODg0LTM1LjU2ODM3bDQuNDQ3LTIxLjQ3NjEzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNi44NTI2NiAtNzUuNDAxNDUpIiBmaWxsPSIjZmZiOGI4Ii8+PHBhdGggZD0iTTY1NS42NDczNCw1NDMuNzkxNjlsLTktM3MtMTQsNC0xNiwxOC0xNyw4NS0xNyw4NS02LDMtMiw4LTIwLDUwLTIwLDUwbDE5LDlzMzgtNDAsMzgtNDQtMS04LTEtMTIsMS00LDAtN2EzMi4xNjY2OSwzMi4xNjY2OSwwLDAsMS0xLThsNy0xNloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgZmlsbD0iI2Y5YTgyNiIvPjxwb2x5Z29uIHBvaW50cz0iNTUzLjkyNSAzODEuODIzIDUyMi41MDYgMzY1LjIyNCA0NzkuMTE5IDM3Mi4wMTQgNDcwLjE0MiA0MTIuMDA1IDQ5Mi40ODggNDExLjEzOCA0OTguNzMgMzk2LjQ0NiA0OTguNzMgNDEwLjg5NSA1MDkuMDQxIDQxMC40OTUgNTE1LjAyNiAzODcuMTA1IDUxOC43NjYgNDEyLjAwNSA1NTUuNDIxIDQxMS4yNSA1NTMuOTI1IDM4MS44MjMiIGZpbGw9IiMyZjJlNDEiLz48cGF0aCBkPSJNNTM4LjA1NzMxLDcxNC40ODE2OXY1Ny42OGgtMTc2LjE4YTU3LjY4MzA5LDU3LjY4MzA5LDAsMCwxLDU3LjY4LTU3LjY4YzE2LjUyLTUuMTUsMzUuNjIwMDYtNi43OSw1Ni4zNC02LjI1QzQ5NS40NDczMyw3MDguNzMxNjksNTE2LjQzNzMyLDcxMS4xODE3LDUzOC4wNTczMSw3MTQuNDgxNjlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIGZpbGw9IiNmZjY1ODQiLz48cGF0aCBkPSJNMzA2LjAzNyw2ODQuMTc3NTdoODIuODQ3NDdhNS4yNDM1LDUuMjQzNSwwLDAsMSw1LjI0MzUsNS4yNDM1djBhNS4yNDM1LDUuMjQzNSwwLDAsMS01LjI0MzUsNS4yNDM1SDMwNi4wMzdhMCwwLDAsMCwxLDAsMHYtMTAuNDg3QTAsMCwwLDAsMSwzMDYuMDM3LDY4NC4xNzc1N1oiIGZpbGw9IiMzZjNkNTYiLz48cGF0aCBkPSJNNTI3LjIzODQyLDY2NS4xMTk2MWwyMi4yMDYzMy0yNi45MTgyOGE1LjgyOTE1LDUuODI5MTUsMCwwLDEsMTAuODY1LjkzMTA3bDguNzU3MTQsMzAuOTE4NDVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA2Ljg1MjY2IC03NS40MDE0NSkiIGZpbGw9IiMzZjNkNTYiLz48cGF0aCBkPSJNNTAwLjMwNTI1LDY3OC44MjlsOC4zODk2Mi0zMy44NzIyNGE1LjgyOTE0LDUuODI5MTQsMCwwLDEsMTAuMi0zLjg1NjY5bDIxLjI2MSwyNC4wOTU4MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDYuODUyNjYgLTc1LjQwMTQ1KSIgZmlsbD0iI2ZmNjU4NCIvPjxwYXRoIGQ9Ik0xNTUuMDIzOTIsNjk2Ljc2MmgxNi43NzkyM2EwLDAsMCwwLDEsMCwwdjM1LjY1NTg5YTE2Ljc3OTIyLDE2Ljc3OTIyLDAsMCwxLTE2Ljc3OTIyLDE2Ljc3OTIyaDBhMCwwLDAsMCwxLDAsMFY2OTYuNzYyQTAsMCwwLDAsMSwxNTUuMDIzOTIsNjk2Ljc2MloiIGZpbGw9IiNmZjY1ODQiLz48cGF0aCBkPSJNMzAyLjg5MDkxLDY4Ni4yNzVoODIuODQ3NDdhNS4yNDM1LDUuMjQzNSwwLDAsMSw1LjI0MzUsNS4yNDM1djBhNS4yNDM1MSw1LjI0MzUxLDAsMCwxLTUuMjQzNTEsNS4yNDM1MUgzMDIuODkwOTFhMCwwLDAsMCwxLDAsMFY2ODYuMjc1QTAsMCwwLDAsMSwzMDIuODkwOTEsNjg2LjI3NVoiIGZpbGw9IiNmZjY1ODQiLz48cGF0aCBkPSJNNTM4LjA1NzMxLDcxNC40ODE2OXY1Ny4zNmE1Ni42NDUzNCw1Ni42NDUzNCwwLDAsMS02Mi4xNi02My42MUM0OTUuNDQ3MzMsNzA4LjczMTY5LDUxNi40MzczMiw3MTEuMTgxNyw1MzguMDU3MzEsNzE0LjQ4MTY5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNi44NTI2NiAtNzUuNDAxNDUpIiBvcGFjaXR5PSIwLjIiLz48Y2lyY2xlIGN4PSIzMzEuMjA1ODYiIGN5PSI2NDAuMTMyMDgiIHI9IjU2LjYyOTkxIiBmaWxsPSIjZmY2NTg0Ii8+PGVsbGlwc2UgY3g9IjM4NS43MzgzNyIgY3k9IjY0NC4zMjY4OSIgcng9IjYuMjkyMjEiIHJ5PSIxNC42ODE4MyIgZmlsbD0iIzNmM2Q1NiIvPjxlbGxpcHNlIGN4PSIzNzAuNTMyMTkiIGN5PSI2MjkuMTIwNzEiIHJ4PSIxLjU3MzA1IiByeT0iMy42NzA0NiIgZmlsbD0iIzNmM2Q1NiIvPjxlbGxpcHNlIGN4PSIzODIuMDY3OTEiIGN5PSI2MjEuNzc5OCIgcng9IjEuNTczMDUiIHJ5PSIzLjY3MDQ2IiBmaWxsPSIjM2YzZDU2Ii8+PHBhdGggZD0iTTUzMy4zMDc0LDY1OC4yNzMzMnMtMy4xNDc0OS01LjQ3NTE5LTMuMTQ3NDktOC44MTUyNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNi44NTI2NiAtNzUuNDAxNDUpIiBmaWxsPSIjM2YzZDU2Ii8+PHBhdGggZD0iTTUzNC42OTIsNjU0LjczMjFzMS43MTUtNi4wNzgwOSw0LjEwMzQ2LTguNDEyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNi44NTI2NiAtNzUuNDAxNDUpIiBmaWxsPSIjM2YzZDU2Ii8+PC9zdmc+" />
            }
          />
      }
    </Fragment>
  );
}

export default BeneficiaryList;
