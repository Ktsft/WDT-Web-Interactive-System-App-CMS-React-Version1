import React, { Fragment } from 'react';
import ReactDom from 'react-dom';


import spinner from '../assets/loading.png';
import '../styles/animation.css';
import {Mask} from "../components/index";

export const Loading = props =>{

    return ReactDom.createPortal(
        <Fragment>
            {
                props.show? 
                <Mask maskClosable={props.maskClosable} onClose={props.onClose}>
                    <div style={styles.loadingContent}>
                        <img className="spin" 
                        // style={styles.loadingSpinner} 
                        src={spinner} alt="spinner" />
                    </div>
                </Mask>: null}
        </Fragment>,
        document.body
    )
};


const styles = {
    loadingContent:{
        padding: '350px 60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50px',
        zIndex: 999,
        top: "100px",
    },
    loadingSpinner:{
        width:'0px',
        height:'0px'
    }
};