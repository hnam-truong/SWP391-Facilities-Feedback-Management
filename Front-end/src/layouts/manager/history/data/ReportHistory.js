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
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import HelperFunction from "layouts/manager/tables/data/HelperFunction";
import { Modal } from 'react-overlays';
import Zoom from '@material-ui/core/Zoom';
export default function data() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showHelperFunction, setShowHelperFunction] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [cateFilter, setCateFilter] = useState("All");
  const [categories, setCategories] = useState([]);

  const handleHelperFunctionClick = (feedback) => {
    setSelectedFeedback(feedback);
    setShowHelperFunction(true);
  };

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
    fetch("https://localhost:7157/api/Feedbacks/UndoFeedback?feedbackId=" + feedbackId + "&response=" + feedbackId, option)
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

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    fetchData(`By${status.charAt(0) + status.slice(1)}`, status);
  };

  const handleCateChange = (event) => {
    const catLoc = event.target.value;
    setCateFilter(catLoc);
    fetchData(`By${catLoc.charAt(0) + catLoc.slice(1)}`, catLoc);
  };

  useEffect(() => {
    // Define the URL of your API endpoint to fetch categories
    const categoriesUrl = "https://localhost:7157/api/Cate/GetAllCate";

    // Make a GET request to fetch categories
    fetch(categoriesUrl)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

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
          timeout={500}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '50%',
              height: '80%',
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

  const feedbackRows = feedbacks
    .filter((feedback) =>
      (feedback.status === "Closed" || feedback.status === "Rejected" || feedback.status === "Expired") &&
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
          <IconButton onClick={() => { handleHelperFunctionClick(feedback) }}>
            <MDTypography>
              <h6>{feedback.title}</h6>
            </MDTypography>
          </IconButton>
        </div>,
      cate: <Info category={feedback.cate.description} location={feedback.locationId} />,
      status: (
        <MDBox ml={-1}>
          {(() => {
            switch (feedback.status) {
              case "Closed":
                return (
                  <MDBadge badgeContent="closed" color="success" variant="gradient" size="sm" />
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
      time: <>
        <Time day={feedback.dateTime} />
        {selectedFeedback === feedback && (
          <>
            <FeedbackModal show={showHelperFunction} handleClose={() => setShowHelperFunction(false)} selectedFeedback={selectedFeedback} action="Accept"/>
          </>
        )}
      </>,
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
      {
        Header: (
          <span>
            cate/loc:{""}
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
        align: "left"
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
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </Select>
          </span>
        ),
        accessor: "status",
        align: "center"
      },
      { Header: "day/time", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: feedbackRows,
  };
}
