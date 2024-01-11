import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import '../styles/app.css';
import { Loading } from '../components/index';




export const GrettingRoom = ({ id = 'default-id', onClose}) => {

    const [data, setData] = useState([]);
    const [roomName, setRoomName] = useState('');
    const [messageStatus, setMessageStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMessageIds, setSelectedMessageIds] = useState([]);
    const [defaultImg, setDefaultImg] = useState("");
    const [autoApproveActive, setAutoApproveActive] = useState(false);


    const itemsPerPage = 5; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem('token');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // const itemsToDisplay = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
        }
    };


    useEffect(() => {
        if(id !== 'default-id'){
            onHandleGrettingMessageDetailByRoom(id);
            onHandleDefaultImage();
        }   
    }, []);


    const onHandleDefaultImage = () =>[
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


    const onHandleGrettingMessageDetailByRoom = (id) => {
        //console.log("this is the id", id);
        console.log("token: ", token);
        Axios.get("https://web-intractive-system-app-api.onrender.com/get/greetingMessageDetailByRoom", {
            params: { id }})
        .then(response => {
            setData(response.data);
            setRoomName(response.data[0].room_name);
        })
        .catch(error => {
            console.log(error);
        });
    }; 


    const handleStatusChange = (status) => {
        setMessageStatus(status);
    };


    const handleRemoveGreetingMessageById = (gretting_id, room_id) => {
        Axios.post("https://web-intractive-system-app-api.onrender.com/delete/GreetingMessage", {
            greeting_id : gretting_id,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log(response);
            onHandleGrettingMessageDetailByRoom(room_id);
        })
        .catch(error => {
            console.log(error);
        });
    };


    const handleGreetingMessageStatus = (status, statusId, roomId) =>{
        // setLoading(true);
        

        if(status == 3){
            setLoading(true);
            const messageIdsToApprove = data.map((item) => item.id);
            selectedMessageIds.push(...messageIdsToApprove);

            Axios.post("https://web-intractive-system-app-api.onrender.com/update/AutoApproveGreetingMessage", {
                room_id : selectedMessageIds,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
            //     setLoading(false);
            //     onHandleGrettingMessageDetailByRoom(roomId);
            //     // console.log("this is the response: ", response);
            // //   window.parent.hideModal();
                setLoading(false);
                onHandleGrettingMessageDetailByRoom(roomId);
            })
            .catch(error => {
                console.log(error);
            });

        }else{
            Axios.post("https://web-intractive-system-app-api.onrender.com/update/greetingMessageStatus", {
            status : status,
            id : statusId,
            }, {
            headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setLoading(false);
                onHandleGrettingMessageDetailByRoom(roomId);
                // console.log("this is the response: ", response);
            //   window.parent.hideModal();
            })
            .catch(error => {
                console.log(error);
            });
        }
    };

    const handleRefresh = () => {
        // Call the API again to refresh the data
        onHandleGrettingMessageDetailByRoom(id);
    };

    return(
        <div>
            {loading && (<div className="loading-overlay"></div>)}
            <Loading show={loading}/>
        <div className="container">
             <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="btn-group btn-group-toggle" data-toggle="buttons" >
                    <button type="button" className={`btn btn-outline-primary ${messageStatus === null ? 'active' : ''}`} onClick={() => handleStatusChange(null)}>
                        <i className="fa fa-eye"></i> All List
                    </button>
                    <button type="button" className={`btn btn-outline-secondary ${messageStatus === 0 ? 'active' : ''}`} onClick={() => handleStatusChange(0)}>
                        <i className="fa fa-eye"></i> Pending List
                    </button>
                    <button type="button" className={`btn btn-outline-success ${messageStatus === 1 ? 'active' : ''}`} onClick={() => handleStatusChange(1)}>
                        <i className="fa fa-eye"></i> Approve List
                    </button>
                    <button type="button" className={`btn btn-outline-danger ${messageStatus === 2 ? 'active' : ''}`} onClick={() => handleStatusChange(2)}>
                        <i className="fa fa-eye"></i> Decline List
                    </button>
                </div>
                <div className="btn-group btn-group-toggle float-right" data-toggle="buttons" style={{ marginLeft: '395px' }}>
                    <button id="autoApproveButton"   className={`btn btn-outline-dark ${autoApproveActive ? 'active' : ''}`}
                    onClick={() => {
                        handleGreetingMessageStatus(3, 0, id); 
                        setAutoApproveActive(true); // This should trigger your Auto Approve logic
                      }}>
                        <i className="fa fa-check"></i><span>Auto Approve Greeting</span>
                    </button>
                    <button id="refreshButton" className="btn btn-outline-primary" onClick={() => handleRefresh(id)}>
                        Refresh
                    </button>
                </div>
             </div>
            <hr />
            {/* <p>Room Name: {roomName}</p> */}
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
            <hr />
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Sender</th>
                        <th scope="col">Greeting Message</th>
                        <th scope="col">Image</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                {/* {data[messageStatus === 0 ? 'pending' : messageStatus === 1 ? 'approve' : 'reject'].map((item, index) => (
                    
                ))} */}
                {data ? (
                    data
                    .filter((item) => messageStatus === null || item.message_status === messageStatus)
                    .slice(startIndex, endIndex)
                    .map((item, index) => (
                        <tr key={index}>
                    <td scope="row">{item.no}</td>
                    <td>{item.sender_name}</td>
                    <td>{item.content}</td>
                    <td>
                        <img
                        className="mode-image"
                        id="wedding_image"
                        height={120}
                        src={item.sender_img || defaultImg}
                        alt="image"
                        />
                    </td>
                    <td>
                        <button type="button" className={`btn btn-outline-primary ${item.message_status === 0 || messageStatus === 0 ? 'active' : ''}`} style={{ marginRight: '5px' }} onClick={() => handleGreetingMessageStatus(0, item.id, id)} >Pending</button>
                        <button type="button" className={`btn btn-outline-success ${item.message_status === 1  || messageStatus === 1 ? 'active' : ''}`} style={{ marginRight: '5px' }} onClick={() => handleGreetingMessageStatus(1, item.id, id)} >Approve</button>
                        <button type="button" className={`btn btn-outline-danger ${item.message_status === 2  || messageStatus === 2 ? 'active' : ''}`} style={{ marginRight: '5px' }} onClick={() => handleGreetingMessageStatus(2, item.id, id)} >Reject</button>
                        <button type="button" className="btn btn-outline-warning" onClick={() => handleRemoveGreetingMessageById(item.id, id)} >Delete</button>
                    </td>
                    </tr>
                    ))
                    ) : (
                    <p>Loading data...</p>
                    )}
                </tbody>
            </table>
        </div>
        </div>
    )
};