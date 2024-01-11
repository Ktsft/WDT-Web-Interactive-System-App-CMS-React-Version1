import React, { useState, useEffect } from 'react';
import { Button, Modal } from '../components/index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import Axios from 'axios';
import moment from 'moment';
import '../styles/app.css';
import dateFormat from 'dateformat';


export const RoomSetting = ({ id = 'default-id', onClose, onCloseModals, showToast }) => {
    const token = localStorage.getItem('token');
    const [gameMode, setGameMode] = useState("");
    const [themeIndex, setThemeIndex] = useState("");
    const [layoutDirection, setLayoutDirection] = useState("");

    const [backgroundImg, setBackgroundImg] = useState("");
    const [appLogoImg, setAppLogoImg] = useState("");
    const [coverPhotoImg, setCoverPhotoImg] = useState("");
    const [welcomeTextColor, setWelcomeTextColor] = useState("");
    const [nameIconColor, setNameIconColor] = useState("");
    const [dropdownHighlightColor, setDropdownHighlightColor] = useState("");
    const [greetingScrollBackgroundColor, setGreetingScrollBackgroundColor] = useState("");
    const [submitButtonImg, setSubmitButtonImg] = useState("");
    const [defaultImg, setDefaultImg] = useState("");

    const [roomName, setRoomName] = useState("");
    const [roomDesc, setRoomDesc] = useState("");
    const [restrictedWord, setRestrictedWord] = useState('');
    const [defaultGreeting, setDefaultGreeting] = useState('');
    const [roomStatus, setRoomStatus] = useState(0);

    const [title, setTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');



    const [startDate, setStartDate] = useState(null);  // Initialize with the current date and time
    const [endDate, setEndDate] = useState(null);  // Initialize with the current date and time
    const [isActiveChecked, setIsActiveChecked] = useState(false);


    useEffect(() => {
        // console.log("this is the id from modal: ", id);
        if (id !== 'default-id') {

            Axios.get("https://web-intractive-system-app-api.onrender.com/room/get/" + id, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {

                    onHandleRoomSetting();
                    onHandleDefaultImage();
                    // console.log("i get the value: ", response.data['game_mode']);
                    setRoomName(response.data['room_name']);
                    setRoomDesc(response.data['room_description']);
                    setGameMode(response.data['game_mode']);
                    setThemeIndex(response.data['theme_index']);
                    setLayoutDirection(response.data['layout_direction']);
                    setRoomStatus(response.data['room_status']);

                    //  const startDateValue = moment(response.data["start_date"]).toDate();
                    // // console.log("start date value: ", startDateValue);
                    // setStartDate(startDateValue);
                    // const endDateValue = new Date(response.data["end_dates"]);
                    // // console.log("this is the end date: ", endDateValue);
                    // setEndDate(endDateValue);
                    // if (response.data["start_date"] && response.data["end_dates"]) {
                    //     const startDateValue = moment(response.data["start_date"]).toDate();
                    //     setStartDate(startDateValue);

                    //     const endDateValue = new Date(response.data["end_dates"]);
                    //     setEndDate(endDateValue);
                    // } else {
                    //     // Set default values for start_date and end_dates
                    //     setStartDate(new Date());
                    //     setEndDate(new Date());
                    // }

                    if (response.data["start_date"] === "1970-01-01T00:00:00.000Z" && response.data["end_dates"] === "1970-01-01T00:00:00.000Z") {
                        setStartDate(null);
                        setEndDate(null);
                    } else if (response.data["start_date"] != null && response.data["end_dates"] != null) {

                        const startDateValue = moment(response.data["start_date"]).toDate();
                        setStartDate(startDateValue);

                        const endDateValue = moment(response.data["end_dates"]).toDate();
                        setEndDate(endDateValue);
                    }

                    // let restrictedWordString = JSON.stringify(response.data['restricted_word']);
                    // restrictedWordString = restrictedWordString.replace(/["\\\[\]]/g, "");
                    // restrictedWordString = restrictedWordString.replace(/,/g, "\n");
                    // restrictedWordString = restrictedWordString.replace(/u0027/g, "'");
                    // setRestrictedWord(restrictedWordString);
                    setRestrictedWord(response.data['restricted_word'].split('|').join('\n'));


                    // Process default_greeting
                    let defaultGreetingString = JSON.stringify(response.data['default_greeting']);
                    defaultGreetingString = defaultGreetingString.replace(/["\\\[\]]/g, "");
                    defaultGreetingString = defaultGreetingString.replace(/\|/g, '\n');
                    defaultGreetingString = defaultGreetingString.replace(/u0027/g, "'");
                    setDefaultGreeting(defaultGreetingString);

                })
                .catch(error => {
                    console.log("Get Room Id Exception From Modal: ", error);
                });
        }
    }, [id]);


    const onHandleRoomSetting = () => {
        Axios.get("https://web-intractive-system-app-api.onrender.com/roomSetting/get/" + id, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                // console.log("this is the background image: ", response.data['background_img']);
                // const startDateValue = moment(response.data["start_date"]).toDate();
                // // console.log("start date value: ", startDateValue);
                // setStartDate(startDateValue);
                // const endDateValue = new Date(response.data["end_date"]);
                // // console.log("this is the end date: ", endDateValue);
                // setEndDate(endDateValue);
                setBackgroundImg(response.data['background_img']);
                setAppLogoImg(response.data["app_logo_img"]);
                setCoverPhotoImg(response.data["cover_photo_img"]);
                setWelcomeTextColor(response.data["welcome_text_color"]);
                setNameIconColor(response.data["name_icon_color"]);
                setDropdownHighlightColor(response.data["dropdown_highlight_color"]);
                setGreetingScrollBackgroundColor(response.data["greeting_scroll_background_color"]);
                setSubmitButtonImg(response.data["submit_button"]);
            })
            .catch(error => {
                console.log("Get Room Setting Exception From Room Setting: ", error);
            });
    };


    const handleGameModeChange = (newGameMode) => {
        // console.log("this is the new game mode result: ", newGameMode);
        setGameMode(newGameMode);
        // onUpdateGameMode(newGameMode);
    };


    const handleThemeIndexChange = (themeIndexValue) => {
        // console.log("this is the value of theme index: ", themeIndexValue);
        setThemeIndex(themeIndexValue);
    };


    const handleLayoutChange = (layoutValue) => {
        // console.log("this is the value of theme index: ", layoutValue);
        setLayoutDirection(layoutValue);
    };


    const handleImageUpload = (e, field) => {
        // console.log("what is the e.target.file: ", e.target.files[0])
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            switch (field) {
                case 'background_img':
                    // console.log("i access background");
                    setBackgroundImg(reader.result);
                    // console.log("this is the result of backgrounf image:", backgroundImg);
                    break;
                case 'app_logo_img':
                    // console.log("i access app logo");
                    setAppLogoImg(reader.result);
                    break;
                case 'cover_photo_img':
                    // console.log("i access cover photo");
                    setCoverPhotoImg(reader.result);
                    break;
                // Add cases for other image fields
                case 'submit_button_img':
                    // console.log("i access submit button");
                    setSubmitButtonImg(reader.result);
                    break;
                default:
                    break;
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const handleRemoveImg = (field) => {
        switch (field) {
            case 'background_img':
                setBackgroundImg("");
                break;
            case 'app_logo_img':
                setAppLogoImg("");
                break;
            case 'cover_photo_img':
                setCoverPhotoImg("");
                break;
            // Add cases for other image fields
            default:
                break;
        }
    };


    const handleWelcomeTextColorChange = (e) => {
        setWelcomeTextColor(e.target.value);
    };


    const handleNameIconColorChange = (e) => {
        setNameIconColor(e.target.value);
    };

    const handleDropdownHighlightColorChange = (e) => {
        setDropdownHighlightColor(e.target.value);
    };

    const handleGreetingScrollBackgroundColorChange = (e) => {
        setGreetingScrollBackgroundColor(e.target.value);
    };


    const handleRemoveSubmitButtonImg = () => {
        // Implement logic to remove the submit button image here
        // You can clear the value in state or perform any other action
        setSubmitButtonImg('');
    };


    const onHandleCloseSuccessModal = () => {
        setShowModal(false);
    };

    const handleModalConfirmation = () => {
        setShowModal(false);
    };


    const updateRoomSetting = () => {
        console.log("room setting pressed");
        const timeDifference = endDate - startDate;
        console.log("timeDifference: ", timeDifference);
        const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);
        console.log("timeDifferenceInHours: ", timeDifferenceInHours);

        // if (timeDifferenceInHours > 24) {
        //     setShowModal(true);
        //     setTitle("Warning");
        //     setModalContent("Not allowed to create room; time difference is over 24 hours!");
        //     return;
        // }else{

        const restrictedWordArray = restrictedWord.split('\n');
        const defaultGreetingArray = defaultGreeting.split('\n');

        // Replace single quotes with 'u0027' in each element of the array
        const restrictedWordModified = restrictedWordArray.map((word) => word.replace(/'/g, 'u0027'));
        const defaultGreetingModified = defaultGreetingArray.map((greeting) => greeting.replace(/'/g, 'u0027'));

        // Combine the modified array elements back into a single string with '|'
        const restrictedWordFinal = restrictedWordModified.join('|');
        const defaultGreetingFinal = defaultGreetingModified.join('|');

        Axios.post("https://web-intractive-system-app-api.onrender.com/room/update/" + id, {
            roomName: roomName,
            roomDescription: roomDesc,
            gameMode: gameMode,
            themeIndex: themeIndex,
            layoutDirection: layoutDirection,
            restrictedWord: restrictedWordFinal,
            defaultGreeting: defaultGreetingFinal,
            startDate: startDate,
            endDate: endDate
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {

                console.log("update room successfully");
                Axios.post("https://web-intractive-system-app-api.onrender.com/roomSetting/update/" + id, {
                    backgroundImg: backgroundImg,
                    appLogoImg: appLogoImg,
                    coverPhotoImg: coverPhotoImg,
                    welcomeTextColor: welcomeTextColor,
                    nameIconColor: nameIconColor,
                    dropdownHighlightColor: dropdownHighlightColor,
                    greetingScrollBackgroundColor: greetingScrollBackgroundColor,
                    submitButton: submitButtonImg
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response2 => {
                    console.log("update room setting successful");
                    // setShowSuccessModal(true);
                    showToast('Update room successfully', 'success', 'Successful');
                    onCloseModals();
                })
                    .catch(error2 => {
                        console.log("Error exception on update room setting: ", error2);
                    })
            })
            .catch(error => {
                console.log("Error exception on update room: ", error);
            })
        // }

    };




    const onHandleRoomNameChange = (e) => {
        setRoomName(e.target.value);
    };

    const onHandleRoomDescriptionChange = (e) => {
        setRoomDesc(e.target.value);
    };


    const onHandleDefaultImage = () => [
        Axios.get("https://web-intractive-system-app-api.onrender.com/defaultImage/get", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setDefaultImg(response.data["image"]);
                // console.log("this is the default image value: ", response.data["image"]);
            })
            .catch(error => {
                console.log("Get Room Setting Exception From Room Setting: ", error);
            })
    ];


    const onHandleStartDasteSelecteds = (e) => {

        setStartDate(e);

        if (e) {
            const newEndDate = new Date(e);
            newEndDate.setHours(newEndDate.getHours() + 24);
            setEndDate(newEndDate);
        }
    };


    const getStatus = (status) => {
        switch (status) {
            case 0:
                return "Ended";
            case 1:
                return "In Progress";
            case 2:
                return "Not Started Yet";
            default:
                return "Unknown Status";
        }
    };


    return (
        <div className="container">
            <table className="user-table" >
                <tbody>
                    <tr>
                        <th className="create-room-table-label-cell" style={{ padding: '10px' }}>Auto active mode: </th>
                        <td style={{ padding: '29px' }}>
                            {/* <div className="form-check form-switch custom-switch-input">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    role="switch"
                                    checked={roomStatus === 1}
                                    onChange={() => setRoomStatus(roomStatus === 1 ? 0 : 1)}
                                />
                            </div> */}
                            {getStatus(roomStatus)}
                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Start Date: </th>
                        <td style={{ padding: '10px' }}>
                            <DatePicker
                                // Set the width to 100%
                                className="form-control custom-datepicker-width" // Apply the custom-datepicker class here
                                selected={startDate}
                                onChange={(date) => onHandleStartDasteSelecteds(date)}
                                showTimeSelect={false}
                                dateFormat="MMMM d, yyyy"
                                minDate={new Date()} // Disable past dates
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>End Date: </th>
                        <td style={{ padding: '10px' }}>
                            <DatePicker
                                className="form-control custom-datepicker-width"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                showTimeSelect={false}
                                dateFormat="MMMM d, yyyy"
                                disabled={!startDate}
                                minDate={new Date()} // Disable past dates
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Room Name: </th>
                        <td style={{ padding: '10px' }}> <input type="text" name="name" className="form-control" value={roomName} onChange={onHandleRoomNameChange} /></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Room Description: </th>
                        <td style={{ padding: '10px' }}> <input type="text" name="desc" className="form-control" value={roomDesc} onChange={onHandleRoomDescriptionChange} /></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Restricted Word: </th>
                        <td style={{ padding: '10px' }}> <textarea className="form-control" id="restricWordArea" rows="4" value={restrictedWord} onChange={(e) => setRestrictedWord(e.target.value)}></textarea></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" style={{ padding: '10px' }}>Default Greeting: </th>
                        <td style={{ padding: '10px' }}> <textarea className="form-control" id="defaultGreetArea" rows="4" value={defaultGreeting} onChange={(e) => setDefaultGreeting(e.target.value)}></textarea></td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" colSpan="2" ><h2>Big Screen Setting</h2></th>
                    </tr>
                    <tr style={{ padding: '30px' }}>
                        <td>Mode :</td>
                        <td style={{ padding: '10px' }}>
                            <input type="hidden" id="gameModeSelect" value={gameMode} />
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className={`btn btn-outline-primary btn-lg square-button ${gameMode === '1' ? 'active' : ''}`} style={{ marginLeft: '10px', width: '133px' }}>
                                    <input
                                        type="radio"
                                        onChange={() => handleGameModeChange('1')}
                                        checked={gameMode == '1'} // Compare to a string value
                                    />
                                    <span className="mode-label">Mode 1</span>
                                </label>
                                <label className={`btn btn-outline-primary btn-lg square-button ${gameMode === '2' ? 'active' : ''}`} style={{ marginLeft: '10px', width: '133px' }}>
                                    <input
                                        type="radio"
                                        onChange={() => handleGameModeChange('2')}
                                        checked={gameMode == '2'}
                                    />
                                    <span className="mode-label">Mode 2</span>
                                </label>
                                <label className={`btn btn-outline-primary btn-lg square-button ${gameMode === '3' ? 'active' : ''}`} style={{ marginLeft: '10px', width: '150px' }}>
                                    <input
                                        type="radio"
                                        onChange={() => handleGameModeChange('3')}
                                        checked={gameMode == '3'}
                                    />
                                    <span className="mode-label">Mode 3</span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Theme :</td>
                        <td style={{ padding: '10px', paddingLeft: '20px' }}>
                            <input type="hidden" id="themeSelect" value={themeIndex} />
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className={`btn btn-outline-primary btn-lg square-button ${themeIndex === '1' ? 'active' : ''}`} style={{ marginRight: '10px', width: '133px' }}
                                    onClick={() => handleThemeIndexChange('1')}
                                >
                                    <input
                                        type="radio"
                                        onChange={() => handleThemeIndexChange('1')}
                                        checked={themeIndex == '1'}
                                    />
                                    <span className="mode-label">Theme 1</span>
                                </label>
                                <label className={`btn btn-outline-primary btn-lg square-button ${themeIndex === '2' ? 'active' : ''}`} style={{ marginRight: '10px', width: '133px' }}>
                                    <input
                                        type="radio"
                                        onChange={() => handleThemeIndexChange('2')}
                                        checked={themeIndex == '2'}
                                    />
                                    <span className="mode-label">Theme 2</span>
                                </label>
                                <label className={`btn btn-outline-primary btn-lg square-button ${themeIndex === '3' ? 'active' : ''}`} style={{ marginRight: '10px', width: '150px' }} >
                                    <input
                                        type="radio"
                                        onChange={() => handleThemeIndexChange('3')}
                                        checked={themeIndex == '3'}
                                    />
                                    <span className="mode-label">Theme 3</span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Layout :</td>
                        <td style={{ padding: '10px', paddingLeft: '20px' }}>
                            <input type="hidden" id="themeSelect" value={layoutDirection} />
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className={`btn btn-outline-primary btn-lg square-button ${layoutDirection === '1' ? 'active' : ''}`} style={{ marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        checked={layoutDirection == '1'}
                                        onChange={() => handleLayoutChange('1')}
                                    />
                                    <span className="mode-label">Layout 1</span>
                                </label>
                                <label className={`btn btn-outline-primary btn-lg square-button ${layoutDirection === '2' ? 'active' : ''}`} style={{ marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        checked={layoutDirection == '2'}
                                        onChange={() => handleLayoutChange('2')}
                                    />
                                    <span className="mode-label">Layout 2</span>
                                </label>
                                <label className={`btn btn-outline-primary btn-lg square-button ${layoutDirection === '3' ? 'active' : ''}`} style={{ marginRight: '10px', width: '150px' }}>
                                    <input
                                        type="radio"
                                        checked={layoutDirection == '3'}
                                        onChange={() => handleLayoutChange('3')}
                                    />
                                    <span className="mode-label">Layout 3</span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th className="user-table-label-cell" colSpan="2"><h2>Mobile View Setting</h2></th>
                    </tr>
                    <tr>
                        <td>Background Image :</td>
                        <td>
                            <div className="mb-3">
                                <button className="btn btn-outline-danger" onClick={() => handleRemoveImg('background_img')}>
                                    X
                                </button>
                                <img
                                    className="mode-image"
                                    id="background_img_holder"
                                    width="120"
                                    height="120"
                                    src={backgroundImg || defaultImg}
                                    alt="Background"
                                />
                                <input
                                    className="form-control form-control-sm mode-image"
                                    id="background_img"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => handleImageUpload(e, 'background_img')}
                                    style={{ width: '50%', display: 'inline-block' }}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>App Logo Image :</td>
                        <td>
                            <div className="mb-3">
                                <button className="btn btn-outline-danger" onClick={() => handleRemoveImg('app_logo_img')}>
                                    X
                                </button>
                                <img
                                    className="mode-image"
                                    id="app_img_holder"
                                    width="120"
                                    height="120"
                                    src={appLogoImg || defaultImg}
                                    alt="Applogo"
                                />
                                <input
                                    className="form-control form-control-sm mode-image"
                                    id="app_img"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => handleImageUpload(e, 'app_logo_img')}
                                    style={{ width: '50%', display: 'inline-block' }}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Cover Photo Image :</td>
                        <td>
                            <div className="mb-3">
                                <button className="btn btn-outline-danger" onClick={() => handleRemoveImg('cover_photo_img')}>
                                    X
                                </button>
                                <img
                                    className="mode-image"
                                    id="cover_img_holder"
                                    width="120"
                                    height="120"
                                    src={coverPhotoImg || defaultImg}
                                    alt="Mode"
                                />
                                <input
                                    className="form-control form-control-sm mode-image"
                                    id="cover_img"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => handleImageUpload(e, 'cover_photo_img')}
                                    style={{ width: '50%', display: 'inline-block' }}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Welcome Text Color: </td>
                        <td style={{ padding: '10px' }}>
                            <input
                                className="mode-color"
                                id="welcome_text_color"
                                type="color"
                                value={welcomeTextColor}
                                onChange={handleWelcomeTextColorChange}
                            />
                        </td>
                    </tr>
                    <tr style={{ padding: '10px' }}>
                        <td>Name Icon Color: </td>
                        <td style={{ padding: '10px' }}>
                            <input
                                className="mode-color"
                                id="name_icon_color"
                                type="color"
                                value={nameIconColor}
                                onChange={handleNameIconColorChange}
                            />
                        </td>
                    </tr>
                    <tr style={{ padding: '30px' }}>
                        <td style={{ width: '1050px' }}>Dropdown Highlight Color : </td>
                        <td style={{ width: '150px', padding: '10px' }}>
                            <input
                                className="mode-color"
                                id="dropdown_highlight_color"
                                type="color"
                                value={dropdownHighlightColor}
                                onChange={handleDropdownHighlightColorChange}
                            />
                        </td>
                    </tr>
                    <tr style={{ padding: '20px' }}>
                        <td style={{ width: '3350px', padding: '10px' }}>Greeting Scroll Background Color : </td>
                        <td style={{ width: '350px', padding: '10px' }}>
                            <input
                                className="mode-color"
                                id="greeting_scroll_color"
                                type="color"
                                value={greetingScrollBackgroundColor}
                                onChange={handleGreetingScrollBackgroundColorChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Submit Button Image : </td>
                        <td>
                            <div className="mb-3">
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleRemoveSubmitButtonImg}
                                >
                                    X
                                </button>
                                <img
                                    className="mode-image"
                                    id="submit_button_img_holder"
                                    height={120}
                                    src={submitButtonImg || defaultImg}
                                    alt="Submit"
                                />
                                <input
                                    className="form-control form-control-sm mode-image"
                                    id="submit_button_img"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    // onChange={(e) => displayUploadedImage(e)}
                                    onChange={(e) => handleImageUpload(e, 'submit_button_img')}
                                    style={{ width: '50%', display: 'inline-block' }}
                                />
                                <input
                                    id="submit_button_img_base64String"
                                    value={submitButtonImg}
                                    type="hidden"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <Button type="button" classType="btn btn-danger" text="Discard" buttonWidth="20%" onClick={onClose} />
                <Button type="button" classType="btn btn-primary" text="Save" buttonWidth="20%" onClick={updateRoomSetting} />
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
    )
}
