/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

// Images

//MUI
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import SwitchStar from "./SwitchStar";

export default function data() {
  const badgeContent = "waiting"; // Replace this with the actual badge content
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Feedbacks/AllFeedbacks";

    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleUndoReport = (feedbackId) => {
    var option = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Waiting" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/UpdateStatus?feedbackId="+ feedbackId + "&\status=Waiting", option)
      .then((response) => { response.text() })
      .then((data) => {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((prevFeedback) =>
            prevFeedback.feedbackId === feedbackId
              ? { ...prevFeedback, status: "Waiting" }
              : prevFeedback
          )
        );
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

  const Time = ({ day }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {day}
      </MDTypography>
    </MDBox>
  );
  const feedbackRows = feedbacks
    .filter((feedback) => feedback.status === "Closed" || feedback.status === "Rejected" || feedback.status === "Expired" )
    .map((feedback) => ({
      star: (
        <Box sx={{ mr: -3, ml: 0 }}>
          <SwitchStar />
        </Box>
      ),
      author: <Author name={feedback.user.username} user={feedback.user.role.description} />,
      title: <h4>{feedback.title}</h4>,
      info: <Info category={feedback.cateId} location={feedback.locationId} />,
      status: (
        <MDBox ml={-1}>
          {(() => {
            switch (feedback.status) {
              case "Closed":
                return (
                  <MDBadge badgeContent="closed" color="inherit" variant="gradient" size="sm" />
                );
              case "Rejected":
                return (
                  <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
                );
              default:
                return (
                  <MDBadge badgeContent="expired" color="dark" variant="gradient" size="sm" />
                );
            }
          })()}
        </MDBox>
      ),
      time: <Time day={feedback.dateTime} />,
      action: feedback.status === "Rejected" ? (
        <div>
          <IconButton onClick={() => handleUndoReport(feedback.feedbackId)}>
            <MDTypography component="a" variant="caption" color="" fontWeight="medium">
              Undo
            </MDTypography>
          </IconButton>
        </div>
      ) : (<MDTypography></MDTypography>),
    }));

    // {
    //   Header: "",
    //   accessor: "checkBox",
    //   align: "right",
    //   width: "0%",
    // },
  return {
    columns: [
      { Header: "", accessor: "star", align: "center", width: "0%" },
      { Header: "author", accessor: "author", align: "left" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "cat/loc", accessor: "info", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "time", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: feedbackRows,
  };
}
