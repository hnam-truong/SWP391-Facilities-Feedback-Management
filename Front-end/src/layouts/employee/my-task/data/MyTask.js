/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Popup from 'reactjs-popup';
import PopUpTask from "./PopUpTask";
import Zoom from '@material-ui/core/Zoom';
import { Modal } from 'react-overlays';
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

//MUI
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

export default function data() {
  const badgeContent = "waiting"; // Replace this with the actual badge content
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [renderTask, setRenderTask] = useState(null); // New state variable
  const getColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 100%, 35%)`; // Adjust lightness to 35%
  };
  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Task/EmployeeID/" + localStorage.getItem('userID');
    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);



  const handleClickOpen = (task) => {
    setSelectedTask(task);
    console.log(task); // This will log the feedbackId of the clicked task
    
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedTask(null); // or however you reset the selected task in your code
    setOpen(false);
  };



  const Time = ({ day }) => {
    // Create a new Date object
    const date = new Date(day);

    // Format the date as DD/MM/YY
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().substr(-2)}`;

    // Format the time as HH:MM
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const taskRows = tasks
    .map((task) => ({
      manager: (
        <MDBox alignItems="center">
          <MDTypography
            display="block"
            variant="caption"
            style={{ color: getColor(task.manager.username) }}
            fontWeight="medium"
          >
            {task.manager.username}
          </MDTypography>
        </MDBox>
      ),
      status: (
        <MDBox ml={-1} className="status-cell">
          <MDBadge
            badgeContent={task.status}
            color={
              task.status === 'Cancelled' ? 'error' :
              task.status === 'Expired' ? 'secondary' :
              task.status === 'Responded' ? 'warning' :
              task.status === 'Delivered' ? 'lightblue' : 'light'
            }
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      time: (
        <MDBox>
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            <Time day={task.dateTime} />
          </MDTypography>
        </MDBox>
      ),
      action: (
        <div>
          <IconButton onClick={() => handleClickOpen(task)}>
            <MDTypography component="a" variant="caption" color="warning" fontWeight="medium">
              Respond
            </MDTypography>
          </IconButton>
      
          {selectedTask === task && (
  <Modal show={open} onHide={handleClose}>
    <div 
      onClick={handleClose} 
      style={{ 
        zIndex: 1000,
        overflowY: 'auto', 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        bottom: 0, 
        left: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
  <Zoom in={open} timeout={2000}>
        <div 
          onClick={(e) => e.stopPropagation()} 
          style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            maxWidth: '90%', 
            maxHeight: '90%', 
            overflowY: 'auto'
          }}
        >
          <button onClick={handleClose}>Close</button>
          <PopUpTask task={selectedTask} />
        </div>
      </Zoom>
    </div>
  </Modal>
)}
        </div>
      ),
    }));

  return {
    columns: [
      { Header: "", accessor: "space", align: "center", width: "0%" },
      { Header: "manager", accessor: "manager", align: "left" },
      // { Header: "title", accessor: "title", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "time", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: taskRows,
  };
}