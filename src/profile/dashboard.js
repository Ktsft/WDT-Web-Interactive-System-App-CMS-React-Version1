import React, { useState, useEffect, useMemo } from 'react';
import { Loading, Table, Navbar, Toast, SuperAdminTable } from '../components/index';
import { useUser } from './userProvider'; // Import useUser from the context
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import Axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import { GearIcon, BookIcon, TrashIcon, QrCodeIcon } from '../assets/icon';
import { RoomSetting, GrettingRoom, ActiveRoom } from '../profile';
import { Modal } from '../components/index';
import _ from 'lodash';


//room status 0 is past 
//room status 1 is active
//room status 2 is inactive 
export const Dashboard = () => {

    const token = localStorage.getItem('token');
    const roles = localStorage.getItem('role');
    const { user, login, logout } = useUser(); // Access user context
    const [username, setUsername] = useState('');
    const [adminRow, setAdminRow] = useState([]);
    const [loading, setLoading] = useState(false);

    const [room, setRoomData] = useState([]);
    const [modalHeight, setModalHeight] = useState(''); // Height for the modal
    const [modalWidth, setModalWidth] = useState(''); // Width for the modal
    const [modalContent, setModalContent] = useState(''); // Content for the modal
    const [modalTitle, setModalTitle] = useState(''); // Title for the modal
    const [isModalOpens, setIsModalOpens] = useState(false); // State to control the modal

    const itemsPerPage = 10; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = room.slice(startIndex, endIndex);
    const totalPages = Math.ceil(room.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const [selectedId, setSelectedId] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [toastHeader, setToastHeader] = useState('');
    const [toastType, setToastType] = useState('');
    const [toastShow, setToastShow] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(true); // Default value based on your logic


    useEffect(() => {
        if (token && user) {
            console.log("Access step 1");
            getUserById(user);
            if (roles === 'superadmin') {
                getUserRolesAdmin();
            } else if (roles === 'admin') {
                fetchRoomData();
            }
        } else {
            //localStorage.clear();
            // You can replace '/login' with the actual path to your login page
            // window.location.href = '/login';

        }
    }, [token, user]); // This effect runs only once when the component mounts 




    useEffect(() => {
        // Update room status based on start and end dates every 500 seconds
        const intervalId = setInterval(async () => {
            // console.log("token", token)
            // console.log("user", user)
            // console.log("roles", roles)

            if (token === null || user === null || roles === null) {
                localStorage.clear();
                window.location.href = '/login';
            }
            else if (roles === 'admin' && room.length > 0) {
                const updatedRoomData = await Promise.all(room.map(async (item) => {
                    let updatedStatus;

                    if (new Date(item.start_date) <= new Date() && new Date() <= new Date(item.end_dates)) {
                        // If start date is between current datetime and end date, set status to 1 (in progress)
                        updatedStatus = 1;
                        if (item.room_status !== 1) {
                            await updateRoomStatus(item.id, updatedStatus);
                        }
                    } else if (item.start_date && new Date(item.start_date) > new Date()) {
                        // If start date hasn't passed the current date, set status to 2 (not started yet)
                        updatedStatus = 2;
                        if (item.room_status !== 2) {
                            await updateRoomStatus(item.id, updatedStatus);
                        }
                    } else if (item.end_dates && new Date() > new Date(item.end_dates)) {
                        // If end date has passed, set status to 0 (ended)
                        updatedStatus = 0;
                        if (item.room_status !== 0) {
                            await updateRoomStatus(item.id, updatedStatus);
                        }
                    }

                    return {
                        ...item,
                        room_status: updatedStatus,
                    };
                }));

                // Check if any room status has changed
                const isAnyStatusChanged = updatedRoomData.some((item, index) => item.room_status !== room[index].room_status);
                // Update the state with the modified room data
                if (isAnyStatusChanged) {
                    setRoomData(updatedRoomData);
                }
            }
        }, 1000); // 500 seconds in milliseconds

        // Clean up the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [roles, room]);


    const updateRoomStatus = async (roomId, updatedStatus) => {
        try {
            const response = await Axios.post(
                'https://web-intractive-system-app-api.onrender.com/room/updateRoomStatus',
                {
                    roomId: roomId,
                    roomStatus: updatedStatus,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.log('Error while fetching user:', error);
        }
    };


    const getUserById = (userId) => {
        Axios.get(`https://web-intractive-system-app-api.onrender.com/user/get/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setUsername(response.data.username);
            })
            .catch(error => {
                console.log('Error while fetching user:', error);
            })
    };


    const getUserRolesAdmin = () => {
        Axios.get("https://web-intractive-system-app-api.onrender.com/get/adminAccount", {
        })
            .then(response => {
                setAdminRow(response.data)
            })
            .catch(error => {
                console.log("Error catch from dashbaord get all room");
            })
    };


    const toggleModal = (content, width, height, title) => {
        setModalContent(content);
        setModalWidth(width);
        setModalHeight(height);
        setModalTitle(title);
        setIsModalOpens(true);
    };


    function formatDate(dateString) {
        if (dateString == null) {
            return ""
        } else {
            return moment(dateString).format("YYYY-MM-DD");
            //return moment(dateString).format("MMMM D, YYYY h:mm A");

        }
    };

    const onRowClick = (id) => {
        // console.log(" **[id onRowClick]** ", id);
        setSelectedId(id); // Set the selected ID
        toggleModal(<RoomSetting id={id} onClose={onCloseModal} onCloseModals={onCloseModals} showToast={showToast} />, '1000px', '1500px', 'Room Setting');
    };


    const onCloseModal = () => {
        // console.log("this is the on close modal pressed");
        setIsModalOpens(false);
    };


    const onCloseModals = () => {
        // Close the modal
        setIsModalOpens(false);
        // Refresh the room data
        fetchRoomData();
    };


    const showToast = (message, type, header) => {
        setToastMessage(message);
        setToastType("success");
        setToastHeader(header);
        setToastShow(true);
        setTimeout(() => {
            setToastShow(false);
        }, 2000); // Adjust the duration as needed
    };

    const onRowClickSetting = (id) => {

        Axios.get("https://web-intractive-system-app-api.onrender.com/get/roomName/" + id, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                let roomNameValue = response.data[0].room_name;

                toggleModal(<GrettingRoom id={id} onClose={onCloseModal} />, '1400px', '1500px', '[Greeting Page] Room name: ' + roomNameValue);
            })
            .catch(error => {
                console.log(error);
            });
    };



    const onHandleRemoveRoom = async (roomId) => {
        try {
            await Axios.post('https://web-intractive-system-app-api.onrender.com/room/delete', {
                roomId: roomId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("deleted successfully");
            showToast('Room deleted successfully', 'success', 'Successful');

            // Refresh the room data
            await fetchRoomData();
        } catch (error) {
            console.log(error);
        }
    };


    const downloadQRCode = (qrCodeBase64, id) => {

        const a = document.createElement('a');
        a.href = qrCodeBase64;
        a.download = `qr_code_${id}.png`;// Set the download filename	
        a.style.display = 'none';

        // Add the anchor element to the document	
        document.body.appendChild(a);

        // Trigger a click event on the anchor element to start the download	
        a.click();

        // Clean up by removing the anchor element	
        document.body.removeChild(a);
    };


    const fetchRoomData = async () => {

        try {
            const response = await Axios.get("https://web-intractive-system-app-api.onrender.com/room/get", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoomData(response.data);
        } catch (error) {
            console.error("Error in fetchData:", error);
        } finally {
            setLoading(false);
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
        <div>
            {loading && (<div className="loading-overlay"></div>)}
            <Loading show={loading} />
            <ToastContainer />
            <Loading show={loading} />
            <div style={{ paddingTop: '95px' }}>
                <div className="container dashboard-container">
                    <Navbar onShowModal={toggleModal} username={username ? username : ''} onRefresh={() => fetchRoomData()} isRoles={roles} />
                    <div className="table-container">
                        {
                            roles === 'admin' ? (
                                <div>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Room ID</th>
                                                <th scope="col">Room Name</th>
                                                <th scope="col">Room Type</th>
                                                <th scope="col">Event Date</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itemsToDisplay.map((item) => (
                                                <tr key={item.id}>
                                                    <th scope="row">{item.id}</th>
                                                    <td>{item.room_name}</td>
                                                    <td>{item.room_type}</td>
                                                    <td>
                                                        {item.start_date && item.end_dates && item.active_status === 1 ?
                                                            "-" :
                                                            `${formatDate(item.start_date)} - ${formatDate(item.end_dates)}`
                                                        }
                                                    </td>
                                                    <td>
                                                        {/* <div className="form-check form-switch">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                role="switch"
                                                                onChange={(e) => {
                                                                    setIsSwitchOn(e.target.checked);
                                                                    //onSwitchClickSetting(item.room_name, item.remaining_duration, item.id, item.room_status, item.last_count_down_time, item.remaining_time, e.target.checked);
                                                                }}
                                                                checked={item.room_status === 1}  // If room_status is 1, set checked to true
                                                                id={`switch_${item.id}`}
                                                            />
                                                            {item.room_status === 0 ? "Ended" : item.room_status === 1 ? "In Progress" : item.room_status === 2 ? "Not Started" : "Unknown Status"}
                                                            <label className="custom-control-label" htmlFor={`switch_${item.id}`}></label>
                                                        </div> */}
                                                        {getStatus(item.room_status)}

                                                    </td>
                                                    <td>
                                                        <button className="btn btn-outline-secondary" id={`gearButton_${item.id}`} onClick={() => onRowClick(item.id)}>
                                                            <GearIcon />
                                                        </button>
                                                        <span style={{ marginLeft: '10px' }}></span>
                                                        <button className="btn btn-outline-primary" id={`gearButton_${item.id}`} onClick={() => onRowClickSetting(item.id)}>
                                                            <BookIcon />
                                                        </button>
                                                        <span style={{ marginLeft: '10px' }}></span>
                                                        <button className="btn btn-outline-danger" id={`gearButton_${item.id}`} onClick={() => onHandleRemoveRoom(item.id)}>
                                                            <TrashIcon />
                                                        </button>
                                                        <span style={{ marginLeft: '10px' }}></span>
                                                        <button className="btn btn-outline-secondary" id={`gearButton_${item.id}`} onClick={() => downloadQRCode(item.qr_code, item.id)} >
                                                            <QrCodeIcon />
                                                        </button>
                                                    </td>
                                                </tr>
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
                                            {Array.from({ length: totalPages }, (_, index) => [
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
                                </div>
                            ) : roles === 'superadmin' ? (
                                // Render superadmin table if roles are 'superadmin'
                                // <p>Unknown user role</p>
                                <SuperAdminTable data={adminRow} onRefresh={() => getUserRolesAdmin()} />
                                // <SuperAdminTable data={room} onRefresh={() => getAllRoom(false)} showToast={showToast} />
                            ) : (
                                // Render some default content when the role is neither 'admin' nor 'superadmin'
                                <p>Unknown user role</p>
                            )}
                    </div>
                </div>
            </div>
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
