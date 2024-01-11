import React , { useState } from 'react';
import { Modal } from '../components/index';
import TableRow from './tableRow';
import { RoomSetting, GrettingRoom, ActiveRoom } from '../profile';
import Axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



export const Table = ({ data, onRefresh, showToast }) =>{


    const itemsPerPage = 10; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isModalOpens, setIsModalOpens] = useState(false); // State to control the modal

    // const [isModalOpen, setIsModalOpens] = useState(false); // State to control the modal
    const [modalContent, setModalContent] = useState(''); // Content for the modal
    const [modalTitle, setModalTitle] = useState(''); // Title for the modal
    const [modalWidth, setModalWidth] = useState(''); // Width for the modal
    const [modalHeight, setModalHeight] = useState(''); // Height for the modal
    const [selectedId, setSelectedId] = useState(null);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const itemsToDisplay = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
        }
    };


    const toggleModal = (content, width, height, title) => {
        setModalContent(content);
        setModalWidth(width);
        setModalHeight(height);
        setModalTitle(title);
        setIsModalOpens(true);
    };


    const onCloseModal = () => {
        // console.log("this is the on close modal pressed");
        setIsModalOpens(false);
    };


    const onCloseModals = () => {
        // console.log("this is the on close modal pressed");
        onRefresh(true);
        setIsModalOpens(false);
    };


    const closemodal = (status) => {
        if(status == "true"){
            onRefresh();
            toast.success("Update date time success !", {
                position: toast.POSITION.TOP_CENTER
            });      
        }
        setIsModalOpens(false);
    };


    const handleRowClick = (id) => {
        setSelectedId(id); // Set the selected ID
        toggleModal(<RoomSetting id={id} onClose={onCloseModal} onCloseModals={onCloseModals} showToast={showToast}/>, '1000px', '1500px', 'Room Setting');
    };


 
    const handleRowSettingClick = (id) =>{

        // console.log("this is handle row setting click: ", id);
        Axios.get("https://web-intractive-system-app-api.onrender.com/get/roomName/"+id,{ 
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            let roomNameValue = response.data[0].room_name;
            toggleModal(<GrettingRoom id={id} onClose={onCloseModal}/> , '1400px', '1500px', '[Greeting Page] Room name: ' + roomNameValue);
        })
        .catch(error => {
            console.log(error);
        });
    };


    const handleSwitchClickSetting = (roomId, status, lastRemainingCountdownTime, remaningtime) => {
        // console.log("status", statusOfActivate);
        console.log("status: ", status);
        console.log("remaningtime: ", remaningtime);

        if(lastRemainingCountdownTime != '24:00:00'){
            if(status == 0){
                setModalTitle("Warning");
                setModalContent("Please top up to renew the room date time!");
                // onCloseModals();
                setModalHeight("200px");
                setModalWidth("400px");
                setIsModalOpens(true);
            }
    
            if(status == 1){
                
                const id = roomId;  
                Axios.post("https://web-intractive-system-app-api.onrender.com/room/activate/update", {
                    id:id,    
                    activeStatus: 5,
                    endDate: remaningtime
                },{
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response2 => {
                        console.log("update room setting successful");
                        onRefresh(true);
                })
                .catch(error2 => {
                        console.log("Error exception on update room setting: ", error2);
                }) 
                
                
    
            }else if (status == 5){
                console.log("test2");
                const id = roomId;
                Axios.post("https://web-intractive-system-app-api.onrender.com/room/activate/update", {
                    id:id,
                    activeStatus: 1,
                    endDate: ""
                },{
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response2 => {
                        console.log("update room setting successful");
                        onRefresh(true);
                })
                .catch(error2 => {
                        console.log("Error exception on update room setting: ", error2);
                }) 
                
                //toggleModal(<ActiveRoom onCloseModals={closemodal} roomId={roomId} />, '700px','3000px', 'Active DateTime Option');
            }else if(status == 4){
                //console.log("test4");
                const id = roomId;
                Axios.post("https://web-intractive-system-app-api.onrender.com/room/activate/update", {
                    id:id,
                    activeStatus: 4
                },{
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response2 => {
                        console.log("update room setting successful");
                        onRefresh(true);
                })
                .catch(error2 => {
                        console.log("Error exception on update room setting: ", error2);
                }) 
            }
        }
        
    };

    const handleModalConfirmation = () => {
        setIsModalOpens(false);
    };

    return(
        <div>
            <ToastContainer />
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Room ID</th>
                        <th scope="col">Room Name</th>
                        <th scope="col">Room Type</th>
                        <th scope="col">Remaining Time</th>
                        <th scope="col">Auto Start</th>
                        <th scope="col">Active</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                {itemsToDisplay.map((item, index) => (
                    <TableRow key={index} item={item} onRefresh={onRefresh} onRowClick={handleRowClick} showToast={showToast}  openModal={toggleModal} onRowClickSetting={handleRowSettingClick} onSwitchClickSetting={handleSwitchClickSetting} />
                ))}
                </tbody>
            </table>

            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from( { length: totalPages }, (_, index) => [
                        <li
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        key={index}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ])}
                    <li
                        className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                        <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        >
                        Next
                        </button>
                    </li>
                </ul>
            </nav>


            {isModalOpens && (
                <Modal
                    show={isModalOpens}
                    onHide={onCloseModal}
                    title={modalTitle}
                    width={modalWidth}
                    height={modalHeight}
                    content={modalContent}
                    // confirmationCallback={handleModalConfirmation} 
                />
                )}


        </div>
    )
}