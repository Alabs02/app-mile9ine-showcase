import { Fragment } from 'react';
import { useRecoilValue } from 'recoil';
import { withSuperAdminBankDetailsQuery } from '../../../recoil/Super/superAdminBankDetails';
import { withGetAllBanksQuery } from '../../../recoil/getAllBanks';
import _, { isEmpty } from 'lodash';

const SuperAdminBankDetailsPartial = () => {

  const bankDetailsArray = useRecoilValue(withSuperAdminBankDetailsQuery);
  const allBanks = useRecoilValue(withGetAllBanksQuery);
  const currentBank = (bankDetailsArray.length > 0) ? _.find(allBanks, (o) => o.code === bankDetailsArray[0]['account_bank']) : {};
  console.log(allBanks);

  return (
    <Fragment>
      {(!isEmpty(bankDetailsArray))
        ? <div className="row">
            {bankDetailsArray.map((bankDetail) => (
              <div key={_.get(bankDetail, 'id', null)} className="col-md-4 col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <h4>{_.get(currentBank, 'name', null)}</h4>
                    <h5>Account Number:</h5>
                    <div className="badge bg-dark-yellow">{_.get(bankDetail, 'account_number', null)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        : <div className="w-100 d-flex justify-content-center">
            <h5>No Bank Details At This Time!</h5>
          </div>
      }
    </Fragment>
  );
}

export default SuperAdminBankDetailsPartial;
