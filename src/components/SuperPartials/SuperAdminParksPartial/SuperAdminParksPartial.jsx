import { Fragment, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { withSuperAdminParksQuery } from '../../../recoil/Super/superAdminParks';
import { TableTemplate } from '../../Template';
import _ from 'lodash';

const SuperAdminParksPartial = () => {

  const parksArray = useRecoilValue(withSuperAdminParksQuery);

  return (
    <Fragment>
      {(!_.isEmpty(parksArray))
        ? <TableTemplate 
            tableData={parksArray}
            tableColumns={[
              'Park Name',
              'Park Address',
              'Park City',
              'Park State',
              'Park Zip',
              'Park Contact',
              'Park Payed',
              'Park Wallet Balance',
              'Park Referer',
            ]}
            dataKeys={[
              'park_name',
              'park_address',
              'park_city',
              'park_state',
              'park_zip',
              'park_contact',
              'park_payed',
              'park_wallet_amount',
              'ref',
            ]}
            searchKey={`park_name`}
            KEYS_TO_FILTER={['park_name']}
            searchPlaceholder={`Search by Park Name First Letter...`}
          />
        : <div className="w-100 d-flex justify-content-center">No Parks At This Time</div>
      }
    </Fragment>
  );
}

export default SuperAdminParksPartial;
