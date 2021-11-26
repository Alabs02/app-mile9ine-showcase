import { each, forOwn } from 'lodash';
import { toast } from 'react-toastify';

const catchAxiosErrors = (err, loadingState, disabledState) => {
  let msg;

  if (err.response && err.response.data.errors) {
    msg = err.response.data?.errors;
  } else if (err.response && err.response.data?.message) {
    msg = err.response.data?.message;
  } else {
    msg = err?.message;
  }

  console.debug("error", msg)
  if (loadingState !== (undefined || null)) {
    loadingState(false);
  }

  if (disabledState !== null) {
    disabledState(false);
  }

  if (Array.isArray(msg)) {
    if (msg !== (undefined || null)) {
      each(msg, (val) => {
        toast.error(val, { autoClose: 6000 });
      });
    }
  } else if (typeof msg === 'object') {
    if (msg !== (undefined || null)) {
      forOwn(msg, (val, key) => {
        toast.error(val[0], { autoClose: 6000 });
        console.log(key, val[0])
      });
    }
  } else if (typeof msg === 'string') {
    toast.error(msg, { autoClose: 6000 });  
  } else if (msg === (undefined || null)) {
    toast.error(`An error occured, please try again.`);
  }
}

export default catchAxiosErrors;