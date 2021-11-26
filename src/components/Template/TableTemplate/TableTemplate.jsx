import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const TableTemplate = ({ tableData=[], searchKey, tableColumns, dataKeys, searchPlaceholder }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const chunkData  = _.chunk(tableData, 10);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredData = chunkData[currentIndex].filter(datum => {
    return _.get(datum, `${searchKey}`, '').indexOf(searchTerm.toLowerCase()) !== -1;
  });

  const prevData = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }
  const nextData = () => {
    if (currentIndex < chunkData.length-1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  console.debug('Chunk Data:', chunkData);

  return (
    <Fragment>
      <div className="card">
        <div className="card-body">
          <input type="search" className="form-control" onChange={e => setSearchTerm(e.target.value)} placeholder={`${searchPlaceholder ? searchPlaceholder : 'Search...'}`} />
        </div>
      </div>
       
      <div className="row">
        <div className="col-xl-12">
          <div className="table-responsive">
            <table className="table table-sm card-table display dataTablesCard rounded-xl">
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
                  {tableColumns && tableColumns.map((columnName, index) => (
                    <th key={index}><strong className="text-muted">{columnName}</strong></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((datum, index) => (
                  <tr key={index}>
                    <td>
                      <div className="checkbox mr-0 align-self-center">
                        <div className="custom-control custom-checkbox ">
                          <input type="checkbox" className="custom-control-input" id="customCheckBox2" required />
                          <label className="custom-control-label" htmlFor="customCheckBox2" />
                        </div>
                      </div>
                    </td>
                    <td>{index+1}</td>
                    {dataKeys.map((dataKey, index) => (
                      <td key={index}>{_.get(datum, dataKey.toString(), null) !== null ? _.get(datum, dataKey.toString(), 'Not Available') : 'Not Available'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="my-3 d-flex justify-content-center align-items-center">
              <button onClick={prevData} disabled={(currentIndex === 0) ? true : false} className="btn btn-sm btn-danger light mr-2" type="button">
                Previous
              </button>
              <div className="overflow-auto d-flex">
                {chunkData.map((chunk, index) => (
                  <button key={index} onClick={() => setCurrentIndex(index)} className={(currentIndex === index) ? "badge badge-circle badge-dark mr-1 px-2" : "badge badge-circle mr-1 bg-dark-yellow px-2"} type="button">{index+1}</button>
                ))}
              </div>
              <button onClick={nextData} disabled={(chunkData.length-1 === currentIndex) ? true : false} className="btn btn-sm btn-danger light ml-1" type="button">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

TableTemplate.propTypes = {
  tableData: PropTypes.array,
  KEYS_TO_FILTER: PropTypes.array,
  tableColumns: PropTypes.array,
  dataKeys: PropTypes.array,
  searchPlaceholder: PropTypes.string,
}

export default TableTemplate;
