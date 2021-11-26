import { Fragment } from 'react';
import { TableTemplate } from '../../Template';
import { useRecoilValue } from 'recoil';
import { withParkStaffTransactionsQuery } from '../../../recoil/parkStaffTransactions';
import { isEmpty } from 'lodash';
import NoEntity from '../../NoEntity';

const AgentTransactionsPartial = () => {

  const transactionArray = useRecoilValue(withParkStaffTransactionsQuery); 
  console.log('Transaction:', transactionArray);

  return (
    <Fragment>
      <div className="mt-3">
        {(!isEmpty(transactionArray))
          ? <TableTemplate
              tableColumns={[
                'Seats',
                'Booking Date',
                'Fare Amount',
                'Status',
                'Booking Code',
                'Leaving Date',
                'Returning Date',
                'Travel Type' 
              ]}
              searchKey={`booking_code`}
              tableData={transactionArray}
              dataKeys={[
                'seats',
                'booking_date',
                'fare_amount',
                'status',
                'booking_code',
                'leaving_date',
                'returning_date',
                'travel_type'
              ]}
            />
          : <NoEntity 
              title={`No ManiFest At This Time`}
              copy={`Use the search button above to get bus manifest!`}
              imgUrl={
                <img alt="" src="data:image/svg+xml;base64,PHN2ZyBpZD0iYjIxNjEzYzktMmJmMC00ZDM3LWJlZjAtM2IxOTNkMzRmYzVkIiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjY0Ny42MzYyNiIgaGVpZ2h0PSI2MzIuMTczODMiIHZpZXdCb3g9IjAgMCA2NDcuNjM2MjYgNjMyLjE3MzgzIj48cGF0aCBkPSJNNjg3LjMyNzksMjc2LjA4NjkxSDUxMi44MTgxM2ExNS4wMTgyOCwxNS4wMTgyOCwwLDAsMC0xNSwxNXYzODcuODVsLTIsLjYxMDA1LTQyLjgxMDA2LDEzLjExYTguMDA2NzYsOC4wMDY3NiwwLDAsMS05Ljk4OTc0LTUuMzFMMzE1LjY3OCwyNzEuMzk2OTFhOC4wMDMxMyw4LjAwMzEzLDAsMCwxLDUuMzEwMDYtOS45OWw2NS45NzAyMi0yMC4yLDE5MS4yNS01OC41NCw2NS45Njk3Mi0yMC4yYTcuOTg5MjcsNy45ODkyNywwLDAsMSw5Ljk5MDI0LDUuM2wzMi41NDk4LDEwNi4zMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNzYuMTgxODcgLTEzMy45MTMwOSkiIGZpbGw9IiNmMmYyZjIiLz48cGF0aCBkPSJNNzI1LjQwOCwyNzQuMDg2OTFsLTM5LjIzLTEyOC4xNGExNi45OTM2OCwxNi45OTM2OCwwLDAsMC0yMS4yMy0xMS4yOGwtOTIuNzUsMjguMzlMMzgwLjk1ODI3LDIyMS42MDY5M2wtOTIuNzUsMjguNGExNy4wMTUyLDE3LjAxNTIsMCwwLDAtMTEuMjgwMjgsMjEuMjNsMTM0LjA4MDA4LDQzNy45M2ExNy4wMjY2MSwxNy4wMjY2MSwwLDAsMCwxNi4yNjAyNiwxMi4wMywxNi43ODkyNiwxNi43ODkyNiwwLDAsMCw0Ljk2OTcyLS43NWw2My41ODAwOC0xOS40NiwyLS42MnYtMi4wOWwtMiwuNjEtNjQuMTY5OTIsMTkuNjVhMTUuMDE0ODksMTUuMDE0ODksMCwwLDEtMTguNzMtOS45NWwtMTM0LjA2OTgzLTQzNy45NGExNC45NzkzNSwxNC45NzkzNSwwLDAsMSw5Ljk0OTcxLTE4LjczbDkyLjc1LTI4LjQsMTkxLjI0MDI0LTU4LjU0LDkyLjc1LTI4LjRhMTUuMTU1NTEsMTUuMTU1NTEsMCwwLDEsNC40MDk2Ni0uNjYsMTUuMDE0NjEsMTUuMDE0NjEsMCwwLDEsMTQuMzIwMzIsMTAuNjFsMzkuMDQ5OCwxMjcuNTYuNjIwMTIsMmgyLjA4MDA4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ni4xODE4NyAtMTMzLjkxMzA5KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik0zOTguODYyNzksMjYxLjczMzg5YTkuMDE1Nyw5LjAxNTcsMCwwLDEtOC42MTEzMy02LjM2NjdsLTEyLjg4MDM3LTQyLjA3MTc4YTguOTk4ODQsOC45OTg4NCwwLDAsMSw1Ljk3MTItMTEuMjQwMjNsMTc1LjkzOS01My44NjM3N2E5LjAwODY3LDkuMDA4NjcsMCwwLDEsMTEuMjQwNzIsNS45NzA3bDEyLjg4MDM3LDQyLjA3MjI3YTkuMDEwMjksOS4wMTAyOSwwLDAsMS01Ljk3MDcsMTEuMjQwNzJMNDAxLjQ5MjE5LDI2MS4zMzg4N0E4Ljk3Niw4Ljk3NiwwLDAsMSwzOTguODYyNzksMjYxLjczMzg5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ni4xODE4NyAtMTMzLjkxMzA5KSIgZmlsbD0iI2ZlNjM0ZSIvPjxjaXJjbGUgY3g9IjE5MC4xNTM1MSIgY3k9IjI0Ljk1NDY1IiByPSIyMCIgZmlsbD0iI2ZlNjM0ZSIvPjxjaXJjbGUgY3g9IjE5MC4xNTM1MSIgY3k9IjI0Ljk1NDY1IiByPSIxMi42NjQ2MiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik04NzguODE4MzYsNzE2LjA4NjkxaC0zMzhhOC41MDk4MSw4LjUwOTgxLDAsMCwxLTguNS04LjV2LTQwNWE4LjUwOTUxLDguNTA5NTEsMCwwLDEsOC41LTguNWgzMzhhOC41MDk4Miw4LjUwOTgyLDAsMCwxLDguNSw4LjV2NDA1QTguNTEwMTMsOC41MTAxMywwLDAsMSw4NzguODE4MzYsNzE2LjA4NjkxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ni4xODE4NyAtMTMzLjkxMzA5KSIgZmlsbD0iI2U2ZTZlNiIvPjxwYXRoIGQ9Ik03MjMuMzE4MTMsMjc0LjA4NjkxaC0yMTAuNWExNy4wMjQxMSwxNy4wMjQxMSwwLDAsMC0xNywxN3Y0MDcuOGwyLS42MXYtNDA3LjE5YTE1LjAxODI4LDE1LjAxODI4LDAsMCwxLDE1LTE1SDcyMy45MzgyNVptMTgzLjUsMGgtMzk0YTE3LjAyNDExLDE3LjAyNDExLDAsMCwwLTE3LDE3djQ1OGExNy4wMjQxLDE3LjAyNDEsMCwwLDAsMTcsMTdoMzk0YTE3LjAyNDEsMTcuMDI0MSwwLDAsMCwxNy0xN3YtNDU4QTE3LjAyNDExLDE3LjAyNDExLDAsMCwwLDkwNi44MTgxMywyNzQuMDg2OTFabTE1LDQ3NWExNS4wMTgyOCwxNS4wMTgyOCwwLDAsMS0xNSwxNWgtMzk0YTE1LjAxODI4LDE1LjAxODI4LDAsMCwxLTE1LTE1di00NThhMTUuMDE4MjgsMTUuMDE4MjgsMCwwLDEsMTUtMTVoMzk0YTE1LjAxODI4LDE1LjAxODI4LDAsMCwxLDE1LDE1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ni4xODE4NyAtMTMzLjkxMzA5KSIgZmlsbD0iIzNmM2Q1NiIvPjxwYXRoIGQ9Ik04MDEuODE4MzYsMzE4LjA4NjkxaC0xODRhOS4wMTAxNSw5LjAxMDE1LDAsMCwxLTktOXYtNDRhOS4wMTAxNiw5LjAxMDE2LDAsMCwxLDktOWgxODRhOS4wMTAxNiw5LjAxMDE2LDAsMCwxLDksOXY0NEE5LjAxMDE1LDkuMDEwMTUsMCwwLDEsODAxLjgxODM2LDMxOC4wODY5MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNzYuMTgxODcgLTEzMy45MTMwOSkiIGZpbGw9IiNmZTYzNGUiLz48Y2lyY2xlIGN4PSI0MzMuNjM2MjYiIGN5PSIxMDUuMTczODMiIHI9IjIwIiBmaWxsPSIjZmU2MzRlIi8+PGNpcmNsZSBjeD0iNDMzLjYzNjI2IiBjeT0iMTA1LjE3MzgzIiByPSIxMi4xODE4NyIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==" />
              }
            />
        }
      </div>
    </Fragment>
  );
}

export default AgentTransactionsPartial;
