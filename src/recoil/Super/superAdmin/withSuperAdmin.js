import superAdminAtom from './atom';
import { selector } from 'recoil';
import { isEmpty, pick } from 'lodash';

const withSuperAdmin = selector({
  key: 'withSuperAdmin',
  get: ({get}) => {
    const data = get(superAdminAtom);
    console.log(data);

    if (isEmpty(data)) {
      return {};
    } 

    return pick(data, ['id', 'email', 'name', 'super_admin_detail.contact']);
  },
  set: ({set}, newAdmin) => set(superAdminAtom, newAdmin),
});

export default withSuperAdmin;