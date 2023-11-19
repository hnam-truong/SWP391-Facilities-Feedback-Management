/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

//MUI
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import HelperFunction from "./HelperFunction";
import Zoom from '@material-ui/core/Zoom';
import { Modal } from 'react-overlays';

export default function data() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [cateFilter, setCateFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showPopupAccept, setShowPopupAccept] = useState(false);
  const [showPopupReject, setShowPopupReject] = useState(false);
  const [showPopupCancel, setShowPopupCancel] = useState(false);
  const [showPopupClose, setShowPopupClose] = useState(false);

  const handleShowPopupAccept = (feedback) => {
    setSelectedFeedback(feedback);
    setShowPopupAccept(true);
  };

  const handleShowPopupReject = (feedback) => {
    setSelectedFeedback(feedback);
    setShowPopupReject(true);
  };

  const handleShowPopupCancel = (feedback) => {
    setSelectedFeedback(feedback);
    setShowPopupCancel(true);
  };

  const handleShowPopupClose = (feedback) => {
    setSelectedFeedback(feedback);
    setShowPopupClose(true);
  };

  const FeedbackModal = ({ show, handleClose, action }) => (
    <Modal show={show} onHide={handleClose}>
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
       <Zoom
  in={show}
  style={{ transitionDelay: show ? '0ms' : '500ms' }}
>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '50%',
              maxHeight: '80%',
              overflowY: 'auto'
            }}
          >
            <button
              onClick={handleClose}
              style={{
                fontSize: '1.5em',
                fontWeight: 'bold',
                color: '#333',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <HelperFunction selectedFeedback={selectedFeedback} action={action} />
          </div>
        </Zoom>
      </div>
    </Modal>
  );


  useEffect(() => {
    // Define the URL of your API endpoint to fetch categories
    const categoriesUrl = "https://localhost:7157/api/Cate/GetAllCate";

    // Make a GET request to fetch categories
    fetch(categoriesUrl)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Feedbacks/AllFeedbacks";

    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));

  }, [feedbacks.feedbackId]);

  const fetchData = (filterType, filterValue) => {
    let apiUrl;

    if (filterValue === "All") {
      apiUrl = "https://localhost:7157/api/Feedbacks/AllFeedbacks";
    } else {
      apiUrl = `https://localhost:7157/api/Feedbacks/${filterType}?${filterType}=${filterValue}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleCateChange = (event) => {
    const catLoc = event.target.value;
    setCateFilter(catLoc);
    fetchData(`By${catLoc.charAt(0) + catLoc.slice(1)}`, catLoc);
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    fetchData(`By${status.charAt(0) + status.slice(1)}`, status);
  };

  const handleCancelReport = (feedbackId) => {
    var option = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Waiting" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/CancelFeedback?feedbackId=" + feedbackId + "&response=" + feedbackId, option)
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
  };

  const handleCloseReport = (feedbackId) => {
    var option = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Closed" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/CloseFeedback?feedbackId=" + feedbackId + "&response=" + feedbackId, option)
      .then((response) => { response.text() })
      .then((data) => {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((prevFeedback) =>
            prevFeedback.feedbackId === feedbackId
              ? { ...prevFeedback, status: "Closed" }
              : prevFeedback
          )
        );
      })
      .catch((error) => {
        console.error("Error: " + error.message);
      });
  };

  const handleTaskReport = (feedbackId) => {
    var option = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Processing" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/AcceptFeedback?feedbackId=" + feedbackId + "&response=" + feedbackId, option)
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
  };

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

  const Time = ({ day }) => {
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
    .filter((feedback) =>
      (feedback.status === "Waiting" || feedback.status === "Processing" || feedback.status === "Responded") &&
      (statusFilter === "All" || feedback.status === statusFilter) &&
      (cateFilter === "All" || feedback.cate.description === cateFilter)
    )
    .sort((a, b) => {
      return b.notify - a.notify || new Date(b.dateTime) - new Date(a.dateTime);
    })
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
      title:
        <div>
          <IconButton onClick={() => { handleShowPopupAccept(feedback); }}>
            <MDTypography>
              <h6>{feedback.title}</h6>
            </MDTypography>
          </IconButton>
        </div>,
      cate: <Info category={feedback.cate.description} location={feedback.locationId} />,
      status: (
        <MDBox ml={-1} className="status-cell">
          <MDBadge
            badgeContent={feedback.status}
            color={
              feedback.status === "Waiting"
                ? "light"
                : feedback.status === "Processing"
                  ? "warning"
                  : feedback.status === "Responded"
                    ? "info"
                    : "default"
            } variant="gradient"
            size="sm"
          />

        </MDBox>
      ),
      time: (
        <>
          <Time day={feedback.dateTime} />
          {selectedFeedback === feedback && (
            <>
              <FeedbackModal show={showPopupAccept} handleClose={() => setShowPopupAccept(false)} action="Accept" selectedFeedback={selectedFeedback} />
              <FeedbackModal show={showPopupReject} handleClose={() => setShowPopupReject(false)} action="Reject" selectedFeedback={selectedFeedback} />
              <FeedbackModal show={showPopupCancel} handleClose={() => setShowPopupCancel(false)} action="Cancel" selectedFeedback={selectedFeedback} />
              <FeedbackModal show={showPopupClose} handleClose={() => setShowPopupClose(false)} action="Close" selectedFeedback={selectedFeedback} />
            </>
          )}
        </>
      ),
      action: (() => {
        switch (feedback.status) {
          case "Waiting":
            return (
              <div>
                <IconButton onClick={() => { handleShowPopupAccept(feedback) }}>
                  <MDTypography component="a" variant="caption" color="success" fontWeight="medium">
                    Accept
                  </MDTypography>
                </IconButton>
                <IconButton onClick={() => { handleShowPopupReject(feedback) }}>
                  <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                    Reject
                  </MDTypography>
                </IconButton>
              </div>
            );
          case "Processing":
            return (
              <div>
                <IconButton onClick={() => { handleShowPopupAccept(feedback) }}>
                  <MDTypography component="a" variant="caption" color="warning" fontWeight="medium">
                    Task
                  </MDTypography>
                </IconButton>
                <IconButton onClick={() => { handleShowPopupCancel(feedback) }}>
                  <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
                    Cancel
                  </MDTypography>
                </IconButton>
              </div>
            );
          case "Responded":
            return (
              <div>
                <IconButton onClick={() => { handleShowPopupClose(feedback) }}>
                  <MDTypography component="a" variant="caption" color="info" fontWeight="medium">
                    Close
                  </MDTypography>
                </IconButton>
                <IconButton onClick={() => { handleShowPopupAccept(feedback) }}>
                  <MDTypography component="a" variant="caption" color="warning" fontWeight="medium">
                    Task
                  </MDTypography>
                </IconButton>
              </div>
            );
        }
      })(),
    }));


  return {
    columns: [
      { Header: "", accessor: "star", align: "center", width: "0%", },
      { Header: "author", accessor: "author", align: "left" },
      {
        Header: "title",
        accessor: "title",
        align: "left",
      },
      {
        Header: (
          <span>
            cate/loc:{" "}
            <Select
              value={cateFilter}
              onChange={handleCateChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((cate) => (
                <MenuItem key={cate.id} value={cate.description}>
                  {cate.description}
                </MenuItem>
              ))}
            </Select>
          </span>
        ),
        accessor: "cate",
        align: "left",
      },
      {
        Header: (
          <span>
            status:{""}
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Waiting">Waiting</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Responded">Responded</MenuItem>
            </Select>
          </span>
        ),
        accessor: "status",
        align: "center",
      },
      { Header: "day/time", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },

    ],

    rows: feedbackRows,

  };
}