import React , { useState, useEffect } from 'react';
import '../styles/app.css';
import { PersonalInfo } from '../assets/icon';



function SuperAdminTableRow({ item, onRefresh, onRowClick }){

    // console.log("this is the super admin table row: ", item);



    return(
        <tr>
            <th scope="row">{item.no}</th>
            <td>
                {item.username}
            </td>
            <td>{item.email}</td>
            <td>{item.verification_status}</td>
            <td>
                <button className="btn btn-outline-secondary" id={`info${item.id}`} onClick={() =>onRowClick(item.id)}>
                    <PersonalInfo />
                </button>
            </td>
        </tr>
    );
}

export default SuperAdminTableRow;