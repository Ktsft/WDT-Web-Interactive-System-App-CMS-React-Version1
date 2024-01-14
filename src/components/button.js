import React from 'react';


export const Button = ({ type, classType, text, onClick, buttonWidth, Icon, disabled }) => {

    const style = {
        width: buttonWidth || '100%', // Set the provided width or '100%' by default
    };

    return (
        <button type={type} className={classType} onClick={onClick} style={style} disabled={disabled}>
            {/* {Icon && <span style={{ marginRight: '5px', marginBottom: '0px' }}>{Icon}</span>} */}
            {text}
        </button>
    )
}