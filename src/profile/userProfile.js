    import React, { useState, useEffect } from 'react';
    import { GearIcon } from '../assets/icon';
    import { Modal } from '../components/index';
    import '../styles/app.css';
    import Axios from 'axios';
    import moment from 'moment';


    export const UserProfile = ({id = 'default-id', onClose}) => {

        // const [roomId, setRoomId] = useState("");
        // const [roomName, setRoomName] = useState("");
        const [data, setData] = useState([]);
        const [totalRoom, setTotalRoom] = useState(0);
        const token = localStorage.getItem('token');

        const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
        const [modalContent, setModalContent] = useState(''); // Content for the modal
        const [modalTitle, setModalTitle] = useState(''); // Title for the modal
        const [modalWidth, setModalWidth] = useState(''); // Width for the modal
        const [modalHeight, setModalHeight] = useState(''); // Height for the modal

        const itemsPerPage = 10; // Number of items to display per page
        const [currentPage, setCurrentPage] = useState(1);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const itemsToDisplay = data.slice(startIndex, endIndex);
        const totalPages = Math.ceil(data.length / itemsPerPage);

        useEffect(() => {
            if(id !== 'default-id'){
                onHandleTotalRoomCreated(id);
            }
        }, [id]);

        useEffect(() => {
            const interval = setInterval(() => {
                setData((prevRoom) => {
                  const updatedRoom = prevRoom.map((item) => {
  
                    
                      const endDatetime = moment(item.end_dates).toDate();
                      const startDatetime = moment(item.start_date).toDate();
  
                      console.log("==========================");
                      console.log("room name: ", item.room_name);
                      
                      const startDateValue = moment(item.start_date).toDate();
                      const formattedStartDatetime = moment(startDateValue).format("MMMM D, YYYY h:mm A");
                      const endDaateValue = moment(item.end_dates).toDate();
                      const formattedEndDatetime = moment(endDaateValue).format("MMMM D, YYYY h:mm A");
                      // console.log("start datex: ", formattedDate);
                      console.log("end date: ", item.end_dates);
                      console.log("===========================");
                      
                      // const formattedEndDatetimess = moment.utc(endDatetime).format('DD/MM/YYYY HH:mm:ss a');
                      // const formattedStartDatetime = moment.utc(item.start_date).format('DD/MM/YYYY HH:mm:ss a');
                      // //============================
                      const now = moment();
                      // console.log("room name: ", item.room_name);
                      // console.log("formattedEndDatetime: ", formattedEndDatetime);
                      // console.log("formattedEndDatetimess: ", formattedEndDatetimess);
                      const remainingSecondsStart = moment(formattedStartDatetime).diff(now, 'seconds');                    
                      const remainingSecondss = moment(formattedEndDatetime).diff(now, 'seconds');
  
                      if(remainingSecondsStart <= 0){
                      const hours = Math.floor(remainingSecondss / 3600);
                      // console.log("remaining seconds: ", hours);
                      const minutes = Math.floor((remainingSecondss % 3600) / 60);
                      // console.log("remaining seconds: ", minutes);
                      const seconds = remainingSecondss % 60;
                      // console.log("remaining seconds: ", seconds);
                      var remainingTimes = `${hours}:${minutes}:${seconds}`;
                    }else{
                          var remainingTimes = "24:00:00";
                    }

                  if (remainingTimes === 'NaN:NaN:NaN') {
                      // If remainingTimes is NaN or negative, set it to "24:00:00"
                      remainingTimes = '24:00:00';
                    }
                    var statusActivate = 0;
                    if(remainingSecondss < 0){
                      remainingTimes = '24:00:00';
                      statusActivate = 3;
                    }
                  
                  const isActive = remainingTimes !== '24:00:00';
                    
                  return {
                      ...item,
                      remaining_time: remainingTimes,
                      roomStatus: isActive ? 1 : 0, // Set roomStatus to 1 if active, 0 if not
                      local_format_end_date: formattedEndDatetime,
                      local_format_start_date: formattedStartDatetime,
                      status_Activate: statusActivate,
                    };
                  });
                  return updatedRoom;
                });
              }, 1000);
            
              return () => {
                clearInterval(interval);
              };
        }, []);

        const onHandleTotalRoomCreated = (id) => {
            console.log("id: ", id);
            Axios.get("https://web-intractive-system-app-api.onrender.com/get/roomByCreated/"+id, {}, {
            })
            .then(response => {
                console.log("this is the total_room: ", response.data);
                setTotalRoom(response.data[0].total_room);
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        };

        const handlePageChange = (newPage) => {
            if (newPage >= 1 && newPage <= totalPages) {
              setCurrentPage(newPage);
            }
        };


        const handleUpdateEnddatetime = (ids, endDates) => {
            // console.log("id: ", id);
            // console.log("endDates: ", endDates);
            // const originalDate = new Date(endDates);
            console.log("enddates : ", endDates);
            const originalDateTime = endDates;
            const newDateTime = addOneHourToDateTime(originalDateTime);
            // console.log("test",newDateTime); // Output: "2023-11-06T03:30:00.000Z"


            // const endDaateValue = moment(originalDateTime).toDate();
            // const formattedEndDatetime = moment(endDaateValue).format("MMMM D, YYYY h:mm A");
            // console.log("formattedEndDatetime: ", formattedEndDatetime);

            // const endDaateValues = moment(newDateTime).toDate();
            // const formattedEndDatetimes = moment(endDaateValues).format("MMMM D, YYYY h:mm A");
            // console.log("add one hour: ", formattedEndDatetimes);

            Axios.post("https://web-intractive-system-app-api.onrender.com/room/datetime/update", {
                    id: ids,
                    endDate: newDateTime
                },{
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response2 => {
                        console.log("update room setting successful");
                        setModalTitle("Success");
                        setModalContent("Add hour successfully");
                        // onCloseModals();
                        setModalHeight("200px");
                        setModalWidth("400px");
                        setIsModalOpen(true);
                })
                .catch(error2 => {
                        console.log("Error exception on update room setting: ", error2);
                }) 
            // // Add one hour
            // originalDate.setHours(originalDate.getHours() + 1);

            // // Format the result as a string in the same format
            // const result = originalDate.toISOString().slice(0, -5) + "+00"; // Remove milliseconds

            // console.log("result : ", result);

        };



        function addOneHourToDateTime(dateTimeString) {
            // Convert the string to a Date object
            const originalDate = new Date(dateTimeString);
          
            // Add one hour
            originalDate.setHours(originalDate.getHours() + 1);
          
            // Format the result as a string in the same format
            const result = originalDate.toISOString();
            
            return result;
          }


          const onCloseModal = () => {
            // console.log("this is the on close modal pressed");
            setIsModalOpen(false);
            onHandleTotalRoomCreated(id);
        };

        return(
            <div className="container">
                <table className="user-table">
                    <tbody>
                        <tr>
                            <th className="user-table-label-cell" style={{ padding: '10px' }}>Total Room: </th>
                            <td style={{ padding: '10px' }}>{totalRoom}</td>
                        </tr>
                    </tbody>
                </table>
                <hr />
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Room ID</th>
                            <th scope="col">Room Name</th>
                            <th scope="col">Room Description</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsToDisplay.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{item.id}</th>
                                <th>{item.room_name}</th>
                                <th>{item.room_description}</th>
                                <th>
                                <button className="btn btn-danger" id={`addhour_${item.id}` } onClick={() => handleUpdateEnddatetime(item.id, item.end_dates)}>
                                    Add Hour
                                </button>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <nav aria-label="Page navigation" style={{ width: '100%' }}>
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
                    <button className="btn btn-danger" onClick={onClose}>Close</button>
                </div>
                
                {isModalOpen && (
                <Modal
                    show={isModalOpen}
                    onHide={onCloseModal}
                    title={modalTitle}
                    width={modalWidth}
                    height={modalHeight}
                    content={modalContent}
                    confirmationCallback={onCloseModal} 
                />
                )}

            </div>
        )
    }