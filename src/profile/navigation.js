import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRoom } from '../profile/createRoom';
import { Modal } from "../components/modal";


export const Navigation = () => {

    const [modalMessage3, setModalMessage3] = useState('');
    const [isModal3Visible, setIsModal3Visible] = useState(false);
    const [modalWidth, setModalWidth] = useState('790px'); // Default width
    const [modalHeight, setModalHeight] = useState('1500px'); // Default height
    const [modalTitle, setModalTitle] = useState('');



    const navigate = useNavigate();

    const showModal3 = (content) => {
        setModalMessage3(content);
        setIsModal3Visible(true);
      };


      const hideModal3 = () => {
        setIsModal3Visible(false);
        // Additional logic...
      };


      const Logout = () => {
        localStorage.removeItem('token');
        // history.push('/login')
        navigate('/login');
     };



      const ShowCreateRoomModal = () => {
        setModalTitle('Create Room');
        const content = <CreateRoom  onCloseModals={hideModal3}/>;
        showModal3(content);
      };


  return (
    <div id="dashboard_header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <span id="welcome_message"></span>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={ShowCreateRoomModal}>
                Create Room
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={Logout}>
                Logout
              </a>
            </li>
            {/* Uncomment the following lines if you have BuyCredit function */}
            {/* <li className="nav-item">
              <a className="nav-link" href="#" onClick={BuyCredit}>
                Buy Credit
              </a>
            </li> */}
          </ul>
        </div>
      </nav>


      {isModal3Visible && (
            <Modal
                show={isModal3Visible}
                onHide={hideModal3}
                title={modalTitle}
                width={modalWidth}
                height={modalHeight}
                content={modalMessage3}
            />
        )}


    </div>
  );
};

