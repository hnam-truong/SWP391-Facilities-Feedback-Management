/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

//MUI
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Button from '@mui/material/Button';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import TextField from '@mui/material/TextField'; import Tooltip from '@mui/material/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function data() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Feedbacks/User/" + localStorage.getItem('userID');

    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleRemoveReport = (feedbackId) => {
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
  }

  const handleUpdate = async (FeedbackId, ManagerId, EmployeeId, Note) => {
    const formData = new FormData();
    try {
      const response = await fetch("https://localhost:7157/api/Feedbacks/Update?"
        + "feedbackId=" + selectedFeedback.feedbackId
        + "&userId=" + localStorage.getItem('userID')
        + "&title=" + selectedFeedback.title
        + "&description=" + selectedFeedback.description
        + "&cateId=" + selectedFeedback.cate.description
        + "&locatoinId=" + selectedFeedback.locationId
        , {
          method: 'POST',
          body: formData
        });
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (feedbackId) => {
    fetch(`https://localhost:7157/api/Feedbacks/Id/${feedbackId}`)
      .then(response => response.json())
      .then(data => {
        setSelectedFeedback(data);
        setOpen(true);
      })
      .catch(error => console.error("Error: " + error.message));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const UpdateForm = () => {
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <Box sx={{ backgroundColor: 'white' }} className='update-report'>
                <a className='update-report-close' href='#updateReport-close'><HighlightOffIcon /></a>
                <TextField
                  inputProps={{ maxLength: 40 }}
                  fullWidth
                  required
                  id="outlined-required"
                  label="Title"
                  value={selectedFeedback.title}
                />
                <div style={{ marginTop: "1rem" }}>
                  <Select
                    inputProps={{ maxLength: 30 }}
                    sx={{ width: '50%', paddingRight: '3px' }}
                    required
                    id="outlined-required"
                    label="Campus"
                    value=''
                  />
                  <Select
                    inputProps={{ maxLength: 4 }}
                    sx={{ width: '50%', paddingLeft: '3px' }}
                    required
                    id="outlined-required"
                    label="Room"
                    value={selectedFeedback.locationId}
                  />
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <Select
                    sx={{ width: '50%', paddingRight: '3px' }}
                    fullWidth
                    required
                    id="outlined-required"
                    label="Category"
                    value={selectedFeedback.cate.description}
                  />
                  <TextField
                    sx={{ width: '50%', paddingLeft: '3px' }}
                    fullWidth
                    required
                    id="outlined-required"
                    label="Images"
                    value=''
                  />
                </div>
                <TextField
                  inputProps={{ maxLength: 300 }}
                  style={{ marginTop: "1rem" }}
                  fullWidth
                  required
                  multiline
                  id="outlined-required outlined-multiline-static"
                  label="More details"
                  value={selectedFeedback.description}
                  rows={6}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            <Button startIcon={<UpgradeIcon />} onClick={handleUpdate} color="primary">
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
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

  const Time = ({ day, expire }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {day}
      </MDTypography>
      <MDTypography variant="caption" color="error">
        {expire}
      </MDTypography>
    </MDBox>
  );

  const feedbackRows = feedbacks
    .sort((a, b) => {
      new Date(a.dateTime) - new Date(b.dateTime);
    })
    .map((feedback) => ({
      author: <Author name={feedback.user.username} user={feedback.user.role.description} />,
      title: <h4>{feedback.title}</h4>,
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
                  <div>
                    <IconButton>
                      <MDTypography onClick={() => handleClickOpen(feedback.feedbackId)} component="a" variant="caption" color="dark" fontWeight="medium">
                        Edit
                      </MDTypography>
                    </IconButton>
                    <IconButton onClick={() => handleRemoveReport(feedback.feedbackId)}>
                      <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                        Remove
                      </MDTypography>
                    </IconButton>
                  </div>
                );
            }
          })()}
        </MDBox>
      ),
    }));

  return {
    columns: [
      { Header: (<UpdateForm />), accessor: "space", align: "center", width: "0%" },
      { Header: "author", accessor: "author", align: "left" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "cat/loc", accessor: "info", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "time/expire", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: feedbackRows,
  };
}
