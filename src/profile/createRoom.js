import React, { useState, useEffect } from 'react';
import { Button, Modal } from '../components/index';
// import jwt_decode from 'jsonwebtoken';
import '../styles/app.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Axios from 'axios'; // Import Axios
// import { Modal } from 'bootstrap';



export const CreateRoom = (props) => {

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user');

    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [restrictedWord, setRestrictedWord] = useState('');
    const [defaultGreeting, setDefaultGreeting] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [isStartDateSelected, setIsStartDateSelected] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);


    useEffect(() => {
        onHandleRestrictedWord();
        onHandleDefaultGreeting();
    }, []);



    const onHandleRestrictedWord = () => {
        Axios.get("https://web-intractive-system-app-api.onrender.com/get/defaultRestrictWord")
            .then(response => {
                // Handle the response data and update the state
                const words = response.data.map(item => item.content);
                const defaultWordString = words.join("\n");
                const newValue = defaultWordString.split('\n')
                    .map((line) => line.replace(/'/g, "u0027").replace(/\.,/g, ".|").replace(/!,/g, "!|"))
                    .join('\n');
                setRestrictedWord(newValue);
            })
            .catch(error => {
                console.error(error);
            });
    };


    const onHandleDefaultGreeting = () => {
        Axios.get("https://web-intractive-system-app-api.onrender.com/get/defaultGreeting")
            .then(response => {
                // Handle the response data and update the state
                const words = response.data.map(item => item.content);
                const defaultGreeting = words.join("\n");
                const newValue = defaultGreeting.split('\n')
                    .map((line) => line.replace(/'/g, "u0027").replace(/\.,/g, ".|").replace(/!,/g, "!|"))
                    .join('\n');
                setDefaultGreeting(newValue)
            })
            .catch(error => {
                console.error(error);
            });
    };


    const onHandleCreateRoom = () => {
        setIsLoading(true);
        const timeDifference = endDate - startDate;
        const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

        const restrictedWordArray = restrictedWord.split('\n');
        const defaultGreetingArray = defaultGreeting.split('\n');

        // Replace single quotes with 'u0027' in each element of the array
        const restrictedWordModified = restrictedWordArray.map((word) => word.replace(/'/g, 'u0027'));
        const defaultGreetingModified = defaultGreetingArray.map((greeting) => greeting.replace(/'/g, 'u0027'));

        const restrictedWordFinal = restrictedWordModified.join('|');
        const defaultGreetingFinal = defaultGreetingModified.join('|');
        var startDateValue;
        var endDateValue;



        Axios.post("https://web-intractive-system-app-api.onrender.com/room/create", {
            roomName: roomName,
            roomDescription: roomDescription,
            remainingDuration: 0,
            ownerId: userId,
            roomMode: 0,
            roomStatus: 0,
            restrictedWord: restrictedWordFinal,
            defaultGreeting: defaultGreetingFinal,
            gameMode: 0,
            themeIndex: 0,
            layoutDirection: 0,
            startDate: startDate,
            endDate: endDate,
            numberOfParticipants: sliderValue,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setIsLoading(false);
                console.log("room created");
                // showCreateRoomModal("Create Room Successfully");
                setShowSuccessModal(true);
                // window.parent.hideModal();
                props.onCloseModal();

            })
            .catch(error => {
                console.log(error);
            });
    };



    const onHandleCloseSuccessModal = () => {
        setShowModal(false);
    };


    const onHandleRoomNameChange = (e) => {
        setRoomName(e.target.value);
    };


    const onHandleRoomDescriptionChange = (e) => {
        setRoomDescription(e.target.value);
    };

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
    };

    const onHandleStartDasteSelecteds = (date) => {
        setStartDate(date);
        if (date) {
            // Calculate max end date (three days from the selected start date)
            setIsStartDateSelected(true);

            const maxEndDate = new Date(date);
            maxEndDate.setDate(maxEndDate.getDate() + 1);

            // Update end date to one more day from the start date
            setEndDate(maxEndDate);
        } else {
            setIsStartDateSelected(false);
        }
    };

    const onHandleEndDateSelecteds = (date) => {
        setEndDate(date);
        // Add any other logic you need here
    };


    const handleModalConfirmation = () => {
        setShowModal(false);
    };




    return (
        <div className="container">
            <table className="user-table">
                <tbody>
                    {/* <tr>
                        <th className="create-room-table-label-cell" style={{ padding: '10px' }}>Auto active mode: </th>
                        <td style={{ padding: '29px' }}>
                            <div className="form-check form-switch custom-switch-input">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    role="switch"
                                    checked={isActiveChecked}
                                    onChange={() => setIsActiveChecked(!isActiveChecked)}
                                />
                            </div>
                        </td>
                    </tr> */}
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Start Date: </th>
                        <td style={{ padding: '10px' }}>
                            <DatePicker
                                className="form-control custom-datepicker-width-create-room"
                                selected={startDate}
                                onChange={(date) => onHandleStartDasteSelecteds(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                minDate={new Date()}
                            />

                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>End Date: </th>
                        <td style={{ padding: '10px' }}>
                            <DatePicker
                                className="form-control custom-datepicker-width-create-room"
                                onChange={(date) => onHandleEndDateSelecteds(date)}
                                selected={endDate} // Ensure that you pass the selected date to the DatePicker
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                disabled={!isStartDateSelected}
                                minDate={new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000)} // Set minDate conditionally 
                                maxDate={new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Room Name:</th>
                        <td style={{ padding: '10px' }}><input type="text" name="roomName" className="form-control" onChange={onHandleRoomNameChange} /></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Room Description:</th>
                        <td style={{ padding: '10px' }}><input type="text" name="roomDesc" className="form-control" onChange={onHandleRoomDescriptionChange} /></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Restricted Word:</th>
                        <td style={{ padding: '10px' }}> <textarea className="form-control" id="restricWordArea" rows="4" value={restrictedWord} onChange={(e) => setRestrictedWord(e.target.value)}></textarea></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Default Greeting:</th>
                        <td style={{ padding: '10px' }}> <textarea className="form-control" id="defaultGreetArea" rows="4" value={defaultGreeting} onChange={(e) => setDefaultGreeting(e.target.value)} ></textarea></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Number Of Participants:</th>
                        <td style={{ padding: '10px' }}>
                            <Box sx={{ width: 500 }}>
                                <Slider defaultValue={0} aria-label="Default" valueLabelDisplay="auto" onChange={handleSliderChange} value={sliderValue} />
                            </Box>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Button type="button" classType="btn btn-danger" text="Discard" buttonWidth="20%" onClick={props.onCloseModals} />
                <Button type="button" classType="btn btn-primary" text="Save" buttonWidth="20%" onClick={onHandleCreateRoom} />
            </div>


            {showModal && (
                <>
                    <Modal
                        show={showModal}
                        onHide={() => onHandleCloseSuccessModal()}
                        title={title}
                        content={modalContent}
                        width="400px"
                        height="200px"
                        confirmationCallback={handleModalConfirmation}
                    />
                </>
            )}


        </div>


    );
};
