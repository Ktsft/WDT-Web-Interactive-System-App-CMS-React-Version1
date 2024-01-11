import React, { useState } from 'react';
import '../styles/app.css';
import DatePicker from 'react-datepicker';
import { Button , Modal } from '../components/index';
import Axios from 'axios'; // Import Axios
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const ActiveRoom = ({onCloseModals, roomId}) => {

    const token = localStorage.getItem('token');
    //console.log("props room id: ", props.roomId);

    const [isActiveChecked, setIsActiveChecked] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [modalContent, setModalContent] = useState('');


    const onHandleStartDasteSelecteds = (e) => {
        
        setStartDate(e);
        
        if(e){
           const newEndDate = new Date(e);
           newEndDate.setHours(newEndDate.getHours() + 24);
           setEndDate(newEndDate);
        }
    };


    const onHandleEndDateSelecteds = (e) => {
        setEndDate(e);
    };


    const onHandleUpdateRoomDateTime = () => {
        const id = roomId;
        const timeDifference = endDate - startDate;
        const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

        if(timeDifferenceInHours > 24){
            setShowModal(true);
            setTitle("Warning");
            setModalContent("Not allowed to create room; time difference is over 24 hours!");
            return false;
        }else{
            if(startDate == null && endDate == null){
                setShowModal(true);
                setTitle("Warning");
                setModalContent("Invalid datetime selected");
                return false;
            }else{
                
                Axios.post("https://web-intractive-system-app-api.onrender.com/room/activate/date/update", {
                    id: id,
                    startDate: startDate,
                    endDate: endDate
                },{
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response2 => {
                    console.log("update room setting successful");
                    onCloseModals("true");
                    // setShowSuccessModal(true);
                    // onCloseModals();                     
                })
                .catch(error2 => {
                    console.log("Error exception on update room setting: ", error2);
                })

            }
        }
    
    };


    const onHandleCloseSuccessModal = () => {
        setShowModal(false);
    };
    

    const handleModalConfirmation = () => {
        setShowModal(false);
    };



    return(
        <div className="container">
            <table className="user-table">
                <tbody>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Option</th>
                        <td style={{ padding: '29px' }}>
                            <div className="form-check form-switch custom-switch-input">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    role="switch"
                                    onChange={() => setIsActiveChecked(!isActiveChecked)}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Start Date: </th>
                        <td style={{ padding: '10px' }}>
                            <DatePicker
                                     // Set the width to 100%
                                     selected={isActiveChecked ? startDate : new Date()}  // Conditionally set to new Date()
                                    className="form-control custom-datepicker-width-create-room" // Apply the custom-datepicker class here
                                    // selected={isActiveChecked ? new Date() : startDate} // Conditionally set to new Date()
                                    // onChange={(date) => setStartDate(date)}
                                    onChange={(date) => onHandleStartDasteSelecteds(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    disabled={!isActiveChecked}
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                />
                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>End Date: </th>
                        <td style={{ padding: '10px' }}>
                            <DatePicker
                                     // Set the width to 100%
                                    selected={isActiveChecked ? endDate : new Date() }  // Conditionally set to new Date()
                                    className="form-control custom-datepicker-width-create-room" // Apply the custom-datepicker class here
                                    // selected={isActiveChecked ? new Date() : startDate} // Conditionally set to new Date()
                                    // onChange={(date) => setStartDate(date)}
                                    onChange={(date) => onHandleEndDateSelecteds(date)}
                                    disabled={!isActiveChecked}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                />
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <br /><br />
            <br />
            <br /><br />
            <br /><br />
            <br />
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Button type="button" classType="btn btn-danger"  text="Discard" buttonWidth="20%" onClick={() => onCloseModals("")} />
                <Button type="button" classType="btn btn-primary"  text="Save" buttonWidth="20%" onClick={onHandleUpdateRoomDateTime} />
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