import _, { isEmpty } from 'lodash';
import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';
import { withSuperAdminReferersQuery } from '../../../recoil/Super/superAdminReferers';
import { TableTemplate } from '../../Template';

const SuperAdminReferersPartial = () => {

  const refererArray = useRecoilValue(withSuperAdminReferersQuery);
  console.log(refererArray);

  return (
    <Fragment>
      { (!isEmpty(refererArray))
        ? <TableTemplate 
            tableData={refererArray}
            tableColumns={[
              'Park Name',
              'User',
              'User Email',
              'User Referal Code',
              'Wallet Balance',
            ]}
            dataKeys={[
              'park.park_name',
              'user.name',
              'user.email',
              'user.user_profile.ref',
              'user.user_profile.user_wallet',
            ]}
            KEYS_TO_FILTER={['park_name']}
            searchKey="name"
            searchPlaceholder={`Search by Park Name First Letter...`}
          />
        : <div class="d-flex w-100 justify-content-center">No Referers At This Time!</div>
      }
    </Fragment>
  );
}

export default SuperAdminReferersPartial;
