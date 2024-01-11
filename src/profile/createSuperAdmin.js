import React, { useState } from 'react';
import { Button, Modal } from '../components/index';
import '../styles/app.css';
import Axios from 'axios';


export const CreateSuperAdmin = ({onCloseModals}) => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState('');

    const token = localStorage.getItem('token');
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [modalContent, setModalContent] = useState('');

    const onHandleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const onHandlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const onHandleEmailChange = (e) => {
        setEmail(e.target.value);
    };


    const onHandleCloseSuccessModal = () => {
        setShowModal(false);
    };
    
    const handleModalConfirmation = () => {
        setShowModal(false);
        onCloseModals();
    };

    const onHandleCreateSuperadmin = () => {
        Axios.post("https://web-intractive-system-app-api.onrender.com/superadmin/create", {
            username: username,
            email: email,
            password: password
        }, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("create superuser success");
            setTitle("Success");
            setModalContent("Create superuser successfully!");
            // onCloseModals();
            setShowModal(true);
        })
        .catch(error => {
            console.error(error);
        })
    };
    
    return(
        <div className="container">
            <table className="user-table">
                <thead>
                    <tr>
                        <th className="user-table-label-cell" style={{ paddign: '10px' }}>Username: </th>
                        <td style={{ padding: '10px' }}><input type="text" name="username" className="form-control" onChange={onHandleUsernameChange}/></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ paddign: '10px' }}>Email: </th>
                        <td style={{ padding: '10px' }}><input type="text" name="email" className="form-control" onChange={onHandleEmailChange}/></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ paddign: '10px' }}>Password: </th>
                        <td style={{ padding: '10px' }}><input type="password" name="password" className="form-control" onChange={onHandlePasswordChange}/></td>
                    </tr>
                </thead>
            </table>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <Button type="button" classType="btn btn-danger"  text="Discard" buttonWidth="20%" onClick={onCloseModals} />
            <Button type="button" classType="btn btn-primary"  text="Save" buttonWidth="20%" onClick={onHandleCreateSuperadmin} />
            </div>

            {showModal && (
            <>
                <Modal 
                    show={showModal}
                    onHide={() => onHandleCloseSuccessModal()}
                    title = {title}
                    content={modalContent}
                    width="400px"
                    height="200px"
                    confirmationCallback={handleModalConfirmation} 
                />
            </>
        )} 
        </div>
    )
};