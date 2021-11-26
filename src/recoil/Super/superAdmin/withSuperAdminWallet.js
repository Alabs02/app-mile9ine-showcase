import superAdminAtom from './atom';
import { selector } from 'recoil';
import { isEmpty, pick } from 'lodash';

const withSuperAdminWallet = selector({
  key: 'withSuperAdminWallet',
  get: ({get}) => {
    const data = get(superAdminAtom);
    console.log(data);

    if (isEmpty(data)) {
      return {};
    } 

    return pick(data, ['id', 'super_admin_detail.super_admin_wallet']);
  },
  set: ({set}, newAdmin) => set(superAdminAtom, newAdmin),
});

export default withSuperAdminWallet;