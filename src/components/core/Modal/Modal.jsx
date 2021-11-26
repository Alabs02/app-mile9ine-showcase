import { Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

const modalRoot = document.getElementById("root");
console.log('Modal:', modalRoot);

const Modal = ({ isOpen, children }) => {
  const el = document.createElement("div");

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);


  return (
    <Fragment>
      {isOpen &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100vh',
              width: '100vw',
              padding: '100px',
              background: "rgba(0, 0, 0, 0.6)",

              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div
              style={{
                width: '50%',
                background: '#fff',
                display: 'block',
              }}
            >
              {children}
            </div>
          </div>,
          el
        )
      }
    </Fragment>
  );
}

export default Modal;
