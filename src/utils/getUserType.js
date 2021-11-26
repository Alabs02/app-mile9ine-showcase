import { localForage } from '../services';
import _ from 'lodash';

const getAuthUserType = async () => {
  const userCredentials = await localForage.getItem('credentials');
  console.log('Credentials', (_.get(userCredentials, 'type', null)));
  if ((_.get(userCredentials, 'type', null)) !== (undefined || null)) {
    return _.get(userCredentials, 'type', null);
  } else {
    return null;
  }
}

export default getAuthUserType;