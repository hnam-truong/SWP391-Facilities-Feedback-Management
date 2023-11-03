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
import TextField from '@mui/material/TextField';import Tooltip from '@mui/material/Tooltip';


export default function data() {
  const badgeContent = "waiting"; // Replace this with the actual badge content
  const [feedbacks, setFeedbacks] = useState([]);
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
      body: JSON.stringify(data),
    };
    fetch("https://localhost:7157/api/Feedbacks/RemoveFeedback/" + feedbackId, option)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error: " + error.message);
      });
  }


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
    .map((feedback) => ({
      author: <Author name={feedback.user.username} user={feedback.user.role.description} />,
      title: <Link><h4>{feedback.title}</h4></Link>,
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
                    <a href='#updateReport' id='openPopUp'>
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
                  </div>
                );
            }
          })()}
          <div id='updateReport' className='overlay'>
            <Box sx={{backgroundColor: 'white'}} className='update-report'>
              <a className='update-report-close' href='#updateReport-close'><HighlightOffIcon /></a>
              <TextField
                inputProps={{ maxLength: 40 }}
                fullWidth
                required
                id="outlined-required"
                label="Title"
                value={feedback.title}
              />
              <div style={{ marginTop: "1rem" }}>
                <TextField
                  inputProps={{ maxLength: 30 }}
                  sx={{ width: '50%', paddingRight: '3px' }}
                  required
                  id="outlined-required"
                  label="Campus"
                  value=''
                />
                <TextField
                  inputProps={{ maxLength: 4 }}
                  sx={{ width: '50%', paddingLeft: '3px' }}
                  required
                  id="outlined-required"
                  label="Room"
                  value={feedback.locationId}
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <TextField
                  sx={{ width: '50%', paddingRight: '3px' }}
                  fullWidth
                  required
                  id="outlined-required"
                  label="Category"
                  value={feedback.cate.description}
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
                value={feedback.description}
                rows={6}
              />
              <Button
                style={{ marginTop: "1rem" }}
                fullWidth
                variant="contained"
                startIcon={<UpgradeIcon />}
                onClick=''
              >
                Update Report
              </Button>
            </Box>
          </div>
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
      { Header: "time/expire", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: feedbackRows,
  };
}
