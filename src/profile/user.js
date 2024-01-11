import React , { useState, useEffect } from 'react';
import { Button, Modal, Loading } from '../components/index';
import Axios from 'axios'; // Import Axios
import { EditIcon, CloseIcon } from '../assets/icon';
import '../styles/app.css';

 

export const User = ({onCloseModal}) => {
    // console.log("this is the props from user.js: ", props);
    
    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const getUserById = () => {
        // console.log("this is the userId: ", userId);
        Axios.get(`https://web-intractive-system-app-api.onrender.com/user/get/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            // console.log('User response from user.js:', response.data.username);
            setUsername(response.data.username);
            setEmail(response.data.email);

        })
        .catch(error => {
            console.log('Error while fetching user:', error);
        });
    };

    useEffect(() => {
        getUserById(userId);
    }, [getUserById, userId]); // Include getUserById and userId in the dependency array


    const onHandleEdit = () =>{
        setIsEditing(true);
    };


    // const onHandleChangeUsername = (e) => {
    //     setUsername(e.target.value);
    // };

    const onHandleChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    

    const onHandleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onHandleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };


    const showChangePasswordModal = (message) =>{
        setModalContent(message);
        setShowModal(true);
    };

    const onHandleCloseSuccessModal = () => {
        setShowModal(false);
        setIsEditing(false);
    };

    const onHandleSave = () =>{
        setIsLoading(true);
        
        Axios.post("https://web-intractive-system-app-api.onrender.com/user/changePassword", {
            password : password,
            new_password : confirmPassword,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setIsLoading(false);
            showChangePasswordModal("Change Password Successfully");
        //   window.parent.hideModal();
        })
        .catch(error => {
            console.log(error);
        });
    };



    return(
        <div className="container">
           <table className="user-table">
                <tbody>
                    {/* <tr className="user-table-tr">
                        <th></th>
                        <th className='edit-button-table' style={{ padding: '10px' }}>
                            <Button 
                                type="button"
                                classType="btn btn-primary"
                                text="Edit"
                                buttonWidth="20%"
                            />
                        </th>
                    </tr> */}
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Username:</th>
                        <td>
                            {/* {isEditing ? (
                                <input 
                                    type="text"
                                    name="username"
                                    value={username}
                                    className="form-control"
                                    onChange={onHandleChangeUsername}
                                />
                            ) : (
                                <span>{username}</span>
                            )} */}
                            <span>{username}</span>
                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Email:</th>
                        <td>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    name="email"
                                    value={email}
                                    className="form-control"
                                    onChange={onHandleChangeEmail}
                                />
                            ) : (
                                <span>{email}</span>
                            )}
                        </td>
                    </tr>                    
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Credit:</th>
                        <td>
                        <span>1.0</span>
                        </td>
                    </tr>
                    {
                        isEditing && (
                            <tr>
                                <th className="user-table-label-cell" style={{ padding: '10px' }}>Password:</th>
                                <td>
                                    <input 
                                        type="password"
                                        name="password"
                                        // value={userData.credit}
                                        className="form-control"
                                        onChange={onHandleChangePassword}
                                    />
                                </td>
                            </tr>
                        )
                    }
                    {
                        isEditing && (
                            <tr>
                                <th className="user-table-label-cell" style={{ padding: '10px' }}>Confirm Password:</th>
                                <td>
                                    <input 
                                        type="password"
                                        name="confirmPassword"
                                        // value={userData.credit}
                                        className="form-control"
                                        onChange={onHandleChangeConfirmPassword}
                                    />
                                </td>
                            </tr>
                        )
                    }
                </tbody>
           </table>
           <hr />
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type="button" classType="btn btn-primary"  text={isEditing ? "Save" : "Edit"} buttonWidth="20%" onClick={isEditing ? onHandleSave : onHandleEdit}  />
                <Button type="button" classType="btn btn-secondary"  text="Close" buttonWidth="20%" onClick={onCloseModal} />
            </div>


            {showModal && (
                <>
                <Modal
                    show={showModal}
                    onHide={() => onHandleCloseSuccessModal()}
                    title="Success"
                    content={modalContent}
                    width="400px"
                    height="200px"
                />
                </>
            )}

        </div>
    )

};