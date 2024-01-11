import React, { useState, useEffect, Component } from 'react';
import { Button, Loading, Modal } from '../components/index';
import { useParams } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
import '../styles/app.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';


export const Verify = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    // const history = useHistory(); 
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    // const [userId, setUserId] = useState(null);
    const [verifiedCode, setVerifiedCode] = useState('');
    localStorage.removeItem('user');
    
    useEffect(() => {
    
        // const urlParams = new URLSearchParams(window.location.search);
        // const id = urlParams.get('id');
        // console.log("this is the id: ", id);
        if (id == 'id' || id == '') {
            navigate('/login');
            // setUserId(id);
        }else{  
            onHandleCheckVerifiedCode(id);
        }

    }, []);


    const onHandleCheckVerifiedCode = (verifiedCode) =>{
        
        Axios.get("https://web-intractive-system-app-api.onrender.com/verificationCode/get/"+verifiedCode, {}, {
          })
          .then(response => {
            // window.location.href = 'admin.html';
            // console.log("this is the response: ", response.data);
            if(response.data == "Verified Code Not Found"){
                // history.push('/login');
                let title = "Invalid verification code";
                let message = "Verification code is invalid!";
                setShowModal(true);
                setModalTitle(title);
                setModalContent(message);
            }else if(response.data == "User Verified"){
                let title = "User verified";
                let message = "Your account has activated!";
                setShowModal(true);
                setModalTitle(title);
                setModalContent(message);
            }
            else if(response.data == "expired"){
                    let title = "Expired";
                    let message = "Your verify link has expired please register again!";
                    setShowModal(true);
                    setModalTitle(title);
                    setModalContent(message);
            }
          })
          .catch(error => {
            console.log(error);
          });
    };

    const onChangeVerifiedCode = (event) => {
        console.log("value: ", event.target.value);
        let value = event.target.value;
        setVerifiedCode(value);
    };


    const onHandleAccountVerified = () => {
        // console.log("test");
        // console.log("user id: ", id);
        Axios.post("https://web-intractive-system-app-api.onrender.com/account/verify", {
            id : id,
            verifiedCode: verifiedCode
        }, { })
          .then(response => {
                // console.log("this is the response body: ", response);
                if(response.data == "Your account has been verified!"){
                    // navigate('/login');

                    let title = "Activate Success";
                    let message = "Your account have activate successfully!";
                    setShowModal(true);
                    setModalTitle(title);
                    setModalContent(message);
                }
          })
          .catch(error => {
                let title = "verify account failed";
                let message = "Please contact IT support verify code invalid";
                showActivateModal(title, message);
                console.log("error package from catch");
          });
        // console.log("this is the value: ", verifiedCode);
    };


    const showActivateModal = (title, message) => {
        setModalContent(message);
        setShowModal(true);
        setModalTitle(title);
    };


    const handleModalConfirmation = () => {
        setShowModal(false);
        navigate('/login');
    };


    return(
        <div>
            <Loading show={loading}/>
            <div className="login-body d-flex justify-content-center align-items-center vh-100">
                <div className="container verify-container">
                    <div style={{ width: '50%' }}>
                            <div className="input-group flex-nowrap justify-content-center"> {/* Add justify-content-center */}
                        <input type="text" className="form-control" placeholder="Verified Code" aria-label="Verified Code" aria-describedby="addon-wrapping"  disabled={loading} onChange={onChangeVerifiedCode} />
                    </div>
                    <div className="text-center mb-3">
                        <br />
                        <p  style={{ color: 'white' }}>Please copy and key in the verification code to activate your account</p>
                    </div>
                    <div className="input-group flex-nowrap justify-content-center">
                        <Button type="button" classType="btn btn-outline-light  btn-block" text="Submit"  disabled={loading} onClick={onHandleAccountVerified}/>
                    </div>
                </div>
            </div>
            </div>


            <Modal 
                show={showModal}
                onHide={() => setShowModal(false)}
                title={modalTitle}
                content={modalContent}
                width="400px"
                height="200px"
                confirmationCallback={handleModalConfirmation} 
            />

        </div>

        
    )

};