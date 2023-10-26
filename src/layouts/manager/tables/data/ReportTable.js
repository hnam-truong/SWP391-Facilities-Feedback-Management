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
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

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

  const handleCancelReport = (feedbackId) => {
    var option = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Waiting" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/UpdateStatus?feedbackId=" + feedbackId + "&\status=Waiting", option)
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

  const handleAcceptReport = (feedbackId) => {
    var option = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Processing" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/UpdateStatus?feedbackId=" + feedbackId + "&\status=Processing", option)
      .then((response) => { response.text() })
      .then((data) => {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((prevFeedback) =>
            prevFeedback.feedbackId === feedbackId
              ? { ...prevFeedback, status: "Processing" }
              : prevFeedback
          )
        );
      })
      .catch((error) => {
        console.error("Error: " + error.message);
      });
  }

  const handleRejectReport = (feedbackId) => {
    var option = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Rejected" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/UpdateStatus?feedbackId=" + feedbackId + "&\status=Rejected", option)
      .then((response) => { response.text() })
      .then((data) => {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((prevFeedback) =>
            prevFeedback.feedbackId === feedbackId
              ? { ...prevFeedback, status: "Rejected" }
              : prevFeedback
          )
        );
      })
      .catch((error) => {
        console.error("Error: " + error.message);
      });
  }

  const handleNoti = (feedbackId) => {
    fetch(
      `https://localhost:7157/api/Feedbacks/Notify?feedbackId=` + feedbackId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((prevFeedback) =>
            prevFeedback.feedbackId === feedbackId
              ? { ...prevFeedback, notify: prevFeedback.notify === 0 ? 1 : 0 }
              : prevFeedback
          )
        );
      })
      .catch((error) => {
        console.error("Error: " + error.message);
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
    .filter((feedback) => feedback.status === "Waiting" || feedback.status === "Processing")
    .map((feedback) => ({
      star: feedback.notify === 0 ? (
        <div>
          <IconButton sx={{ mr: -3, ml: 0 }} onClick={() => handleNoti(feedback.feedbackId)}><StarBorderIcon /></IconButton>
        </div>
      ) : (
        <div>
          <IconButton sx={{ mr: -3, ml: 0 }} onClick={() => handleNoti(feedback.feedbackId)}><StarIcon color="star" sx={{ color: "#ffea00" }} /></IconButton>
        </div>
      ),

      author: <Author name={feedback.user.username} user={feedback.user.role.description} />,
      title: <Link><h4>{feedback.title}</h4></Link>,
      info: <Info category={feedback.cate.description} location={feedback.locationId} />,
      status: (
        <MDBox ml={-1} className="status-cell">
          <MDBadge
            badgeContent={feedback.status}
            color={feedback.status === "Waiting" ? "light" : "warning"}
            variant="gradient"
            size="sm"
          />
          {feedback.status === "Processing" && (
            <div className="hover-content">
              {feedback.tasks.map((task) => (
                <p key={task.id}>{task.employeeId}</p>
              ))}
            </div>
          )}
        </MDBox>
      ),
      time: <Time day={feedback.dateTime} /*expire="48 hours"*/ />,
      action: feedback.status === "Waiting" ? (
        <div>
          <IconButton onClick={() => handleAcceptReport(feedback.feedbackId)}>
            <MDTypography component="a" variant="caption" color="success" fontWeight="medium">
              Accept
            </MDTypography>
          </IconButton>
          <IconButton onClick={() => handleRejectReport(feedback.feedbackId)}>
            <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
              Reject
            </MDTypography>
          </IconButton>
        </div>
      ) : (
        <div>
          <IconButton onClick={() => handleCancelReport(feedback.feedbackId)}>
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
              Cancel
            </MDTypography>
          </IconButton>
        </div>
      ),
    }));

  return {
    columns: [
      { Header: "", accessor: "star", align: "center", width: "0%" },
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
