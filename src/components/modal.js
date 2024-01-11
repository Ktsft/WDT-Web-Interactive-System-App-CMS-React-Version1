import React, { useEffect } from 'react';


export const Modal = ({ show, onHide, title, content, width, height, confirmationCallback  }) => {
        
    const modalStyle = {
        // width: width,
        // height: height,
        maxWidth: width,
        maxHeight: height
    }


    const modalBodyStyle = {
        maxHeight: 'calc(100vh - 200px)', // Adjust the value as needed
        overflowY: 'auto',
    };

    const handleConfirmation = () => {
        if (confirmationCallback) {
            confirmationCallback();
        }
    };

    return (
        <div className={`modal ${show ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered" style={modalStyle}  role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="close" onClick={onHide} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body" style={modalBodyStyle}>
                        {content}
                    </div>
                    {confirmationCallback && (
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleConfirmation}>
                                Confirm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
