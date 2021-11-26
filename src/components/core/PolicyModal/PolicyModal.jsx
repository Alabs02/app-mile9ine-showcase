import { forwardRef, Fragment, is } from 'react';
import Modal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import { CgClose } from 'react-icons/cg';
import './PolicyModal.css';

const PolicyModal = forwardRef((props, ref) => (
  <Fragment>
    <Modal
      ref={ref}
      isOpen={props.isModalOpen}
      scrollable={true}
      draggable={true}
      portal={false}
      className="policy-modal"
      closeButton={<CgClose onClick={props.toggleModal} size={20} className="text-muted" />}
      onClose={props.onClose}
    >
      <div className="modal-header">
        <h5 className="modal-title text-uppercase m-0">{props.title}</h5>
      </div>

      <div className="modal-body">
        {props.children}
      </div>

      <div className="modal-footer d-flex justify-content-end">
        <button type="button" className="btn btn-danger light" onClick={props.toggleModal}>Close</button>
      </div>
    </Modal>
  </Fragment>
));

export default PolicyModal;
