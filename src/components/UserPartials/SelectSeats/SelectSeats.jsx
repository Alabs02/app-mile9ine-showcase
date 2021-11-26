import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { userTempSeatNoAtom } from '../../../recoil/userTempSeatNo';
import { useRecoilState } from 'recoil';
import './SelectSeats.css';
import { toast } from 'react-toastify';

const SelectSeats = ({ seats, selectSeatNo }) => {

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatNo, setSeatNo] = useRecoilState(userTempSeatNoAtom);

  console.log('Selected Seats: ', selectedSeats);

  const chooseSeats = (position) => {
    if (selectedSeats.length >= seatNo) {
      toast.warning(`You can only select ${seatNo} seats!`, {
        autoClose: 6000,
        position: 'top-center'
      })
    } else {
      // if ()
    }
  }


  return (
    <Fragment>
      <div className="w-100">
        <div className="d-app-flex m-0 mb-3">
          <h4 className="saluation salutation__overline m-0">Choose Seat</h4>
        </div>

        <div className="row">
          <div className="col-md-9 col-sm-12 px-4">
            <div className="bus__container px-4">
              <div className="bus">
                <div className="bus__windscreen">
                  <div className="bus__row">
                    {seats.map((seat, index) => (
                      <div key={_.get(seat, 'seat_position', null)} className={`bus__column ${(_.get(seat, 'booked', null)) ? 'bus__column--grey' : 'bus__column--red'}`}>
                        <div className="bus__column--no">{_.get(seat, 'seat_position', null)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bus__footer">
                  <div className="footer__light" />
                  <div className="footer__bumper">
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                  <div className="footer__light" />
                </div>
              </div>
            </div>
        

          </div>
            
          <div className="col-md-3 col-sm-12">

            <div className="sample__list mb-2">
              <div className="sample__media sample__media--red">
              </div>
              <div className="sample__text">Available Seat</div>
            </div>

            <div className="sample__list mb-2">
              <div className="sample__media sample__media--green">
              </div>
              <div className="sample__text">Selected Seat</div>
            </div>

            <div className="sample__list">
              <div className="sample__media sample__media--gray">
              </div>
              <div className="sample__text">Booked Seat</div>
            </div>

          </div>
        </div>
      </div>
    </Fragment>
  );
}

SelectSeats.propTypes = {
  seats: PropTypes.array,
  selectSeatNo: PropTypes.number,
}

export default SelectSeats;
