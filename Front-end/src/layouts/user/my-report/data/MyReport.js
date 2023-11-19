/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import UpdateReport from "./UpdateReport";
//MUI
import IconButton from "@mui/material/IconButton";
import Dialog from '@mui/material/Dialog';
import Zoom from '@material-ui/core/Zoom';
import { Modal } from 'react-overlays';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';

import HelperFunction from "layouts/manager/tables/data/HelperFunction";
export default function data() {
  const [feedbacks, setFeedbacks] = useState([]);
  // Add this line to create a new state variable
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showHelperFunction, setShowHelperFunction] = useState(false);

  const handleEditClick = (feedback) => {
    setSelectedFeedback(feedback);
    setShowUpdateReport(true); // show the UpdateReport component
  };
  const [showUpdateReport, setShowUpdateReport] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));



  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Feedbacks/User/" + localStorage.getItem('userID');

    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleHelperFunctionClick = (feedback) => {
    setSelectedFeedback(feedback);
    setShowHelperFunction(true);
  };

  const handleRemoveReport = (feedbackId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>

            <p style={{ color: '#666' }}>Do you want to delete this feedback?</p>
            <Button onClick={onClose}>Back</Button>
            <Button color="error" onClick={() => {
              var option = {
                method: 'DELETE',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "Removed" }),
              };
              fetch("https://localhost:7157/api/Feedbacks/RemoveFeedback/" + feedbackId, option)
                .then((response) => { response.text() })
                .then((data) => {
                  setFeedbacks((prevFeedbacks) =>
                    prevFeedbacks.map((prevFeedback) =>
                      prevFeedback.feedbackId === feedbackId
                        ? { ...prevFeedback, status: "Removed" }
                        : prevFeedback
                    )
                  );
                })
                .catch((error) => {
                  console.error("Error: " + error.message);
                });
              onClose();
              window.location.reload();
            }}>
              Remove
            </Button>
          </div>
        );
      }
    });
  };

  const Author = ({ name, user }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={0} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{user}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Info = ({ category, location }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {category}
      </MDTypography>
      <MDTypography variant="caption">{location}</MDTypography>
    </MDBox>
  );

  const Time = ({ day, expire }) => {
    // Create a new Date object
    const date = new Date(day);

    // Format the date as DD/MM/YY
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().substr(-2)}`;

    // Format the time as HH:MM
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    return (
      <MDBox lineHeight={1} textAlign="left">
        <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
          {formattedDate}
        </MDTypography>
        <MDTypography variant="caption">
          {formattedTime}
        </MDTypography>
      </MDBox>
    );
  };

  const feedbackRows = feedbacks
    .filter(feedback => feedback.status !== "Removed")
    .sort((a, b) => {
      return new Date(b.dateTime) - new Date(a.dateTime);
    })
    .map((feedback) => ({
      author: <Author name={feedback.user.username} user={feedback.user.role.description} />,
      title:
        <div>
          <IconButton onClick={() => { handleHelperFunctionClick(feedback); }}>
            <MDTypography>
              <h6>{feedback.title}</h6>
            </MDTypography>
          </IconButton>
        </div>,
      info: <Info category={feedback.cate.description} location={feedback.locationId} />,
      status: (
        <MDBox ml={-1}>
          {(() => {
            switch (feedback.status) {
              case "Waiting":
                return (
                  <MDBadge badgeContent={feedback.status} color="light" variant="gradient" size="sm" />
                );
              case "Processing":
                return (
                  <MDBadge badgeContent={feedback.status} color="warning" variant="gradient" size="sm" />
                );
              case "Responded":
                return (
                  <MDBadge badgeContent={feedback.status} color="inherit" variant="gradient" size="sm" />
                );
              case "Closed":
                return (
                  <MDBadge badgeContent={feedback.status} color="success" variant="gradient" size="sm" />
                );
              case "Rejected":
                return (
                  <MDBadge badgeContent={feedback.status} color="error" variant="gradient" size="sm" />
                );
              default:
                return (
                  <MDBadge badgeContent={feedback.status} color="dark" variant="gradient" size="sm" />
                );
            }
          })()}
        </MDBox>
      ),
      time: <Time day={feedback.dateTime} /*expire="48 hours"*/ />,
      action: (
        <MDBox ml={-1}>
          {(() => {
            switch (feedback.status) {
              case "Waiting":

                return (
                  <MDBox>
                    <a onClick={() => handleEditClick(feedback)}>
                      <IconButton>
                        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
                          Edit
                        </MDTypography>
                      </IconButton>
                    </a>
                    <IconButton onClick={() => handleRemoveReport(feedback.feedbackId)}>
                      <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                        Remove
                      </MDTypography>
                    </IconButton>
                  {selectedFeedback === feedback && (
  <Modal show={showUpdateReport} onHide={() => setShowUpdateReport(false)}>
    <div 
      onClick={() => setShowUpdateReport(false)} 
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
      <Zoom in={showUpdateReport} timeout={2000}>
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
          <button onClick={() => setShowUpdateReport(false)}>Close</button>
          <UpdateReport selectedFeedback={selectedFeedback} />
        </div>
      </Zoom>
    </div>
  </Modal>
)}
{selectedFeedback === feedback && (
  <Modal show={showHelperFunction} onHide={() => setShowHelperFunction(false)}>
    <div 
      onClick={() => setShowHelperFunction(false)} 
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
      <Zoom in={showHelperFunction} timeout={2000}>
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
          <button onClick={() => setShowHelperFunction(false)}>Close</button>
          <HelperFunction selectedFeedback={selectedFeedback} />
        </div>
      </Zoom>
    </div>
  </Modal>
)}
                  </MDBox>
                );
            }
          })()}

        </MDBox>
      ),
    }));

  return {
    columns: [
      { Header: "", accessor: "space", align: "center", width: "0%" },
      { Header: "author", accessor: "author", align: "left" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "cat/loc", accessor: "info", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "day/time", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: feedbackRows,
  };
}
