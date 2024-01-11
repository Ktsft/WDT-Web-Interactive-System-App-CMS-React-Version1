import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import { User, CreateRoom, CreateSuperAdmin } from "../profile/index";
import { Modal } from "./modal";
import { UserIcon, CreateIcon, LogOutIcon } from "../assets/icon";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export const Navbar = ({ username, onRefresh, isRoles }) => {

    // const history = useHistory();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null); 
    const [modalWidth, setModalWidth] = useState('400px'); // Default width
    const [modalHeight, setModalHeight] = useState('200px'); // Default height
    const [modalTitle, setModalTitle] = useState('');
    

    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false); 

    const onHandleLogOut = () => {
        localStorage.removeItem('token');
        // history.push('/login')
        navigate('/login');
    };


    const toggleNavbar = () => {
        setExpanded(!expanded);
    };


    const toggleModal = (content, width, height, title) => {

        // if(action === 'username'){
        //     setModalContent(<User onCloseModal={onCloseModal}  />)
        // }else if(action === 'createRoom'){
        //     setModalContent(<createRoom />)
        // }

        // setIsModalOpen(!isModalOpen); 
        setModalContent(content);
        setModalWidth(width);
        setModalHeight(height);
        setIsModalOpen(true); 
        setModalTitle(title);
    };


    const onCloseModal = () => {
        // console.log("this is the on close modal pressed");
        onRefresh(false);
        setIsModalOpen(false);
    };


    const onCloseModals = () => {
        // console.log("this is the on close modal pressed");
        setIsModalOpen(false);
    };


    const onHandleUserNameClick = () => {
        toggleModal(<User onCloseModal={() => onCloseModal()}  />,'700px','900px', 'Information')
    }; 

    return(
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserIcon style={{ marginRight: '10px' }} />
                    <a className="navbar-brand" href="#" onClick={onHandleUserNameClick}>
                        {username}
                    </a>
                </div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded={expanded}  aria-label="Toggle navigation" onClick={toggleNavbar} >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}  id="navbarNav">
                    <ul className="navbar-nav">
                        {/* <li className="nav-item active">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <CreateIcon style={{ marginRight: '1px' }} />
                                <a className="nav-link" href="#" onClick={() =>toggleModal(<CreateRoom onCloseModal={onCloseModal} onCloseModals={onCloseModals} />,'700px','1500px', 'Create Room')} >Create Room <span className="sr-only"></span></a>
                            </div>   
                        </li> */}
                        {!isRoles || isRoles !== 'superadmin' ? (
                        <li className="nav-item active">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CreateIcon style={{ marginRight: '1px' }} />
                            <a className="nav-link" href="#" onClick={() => toggleModal(<CreateRoom onCloseModal={onCloseModal} onCloseModals={onCloseModals} />,'790px','1500px', 'Create Room')} >
                                Create Room <span className="sr-only"></span>
                            </a>
                            </div>
                        </li>
                        ) : 
                        
                        <li className="nav-item active">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CreateIcon style={{ marginRight: '1px' }} />
                            <a className="nav-link" href="#" onClick={() => toggleModal(<CreateSuperAdmin onCloseModals={onCloseModals} />,'790px','1500px', 'Create Super Admin')} >
                                Create Superadmin <span className="sr-only"></span>
                            </a>
                            </div>
                        </li>
                        
                        }
                        <li className="nav-item">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <LogOutIcon style={{ marginLeft: '4px' }} />
                                <a className="nav-link" href="#" onClick={onHandleLogOut}>Log Out</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>

            {isModalOpen && (
                // <Modal 
                //     show={isModalOpen}
                //     onHide={toggleModal}
                //     title="Information"
                //     width="700px"
                //     height="900px"
                //     content={modalContent} 
                // />
                <Modal
                    show={isModalOpen}
                    onHide={onCloseModals}
                    title={modalTitle}
                    width={modalWidth}
                    height={modalHeight}
                    content={modalContent}
                />
            )}

        </div>
    )
}