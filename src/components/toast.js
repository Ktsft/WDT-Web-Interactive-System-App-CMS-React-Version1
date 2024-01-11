import React from 'react';
import { Notification, Placeholder } from 'rsuite';


export const Toast = ({ show, message, type, title }) => {

    const customStyles = {
        position: 'fixed',
        top: '20px', // Adjust the top position as needed
        right: '20px', // Adjust the left position as needed
        zIndex: '10000', // Ensure it's above other content
      };



    const messageStyles = {
        width: '320px', // Adjust the width as needed
        padding: '10px', // Adjust the padding as needed
        left: '200px',
    };


  return (
    <div>
        {
            show &&
            <Notification closable  type={type || 'info'}  header={title} style={customStyles}>
                <div style={messageStyles}>
                    {message} {/* Set the message here */}
                </div>
            </Notification>
        }
    </div>
  );
};
