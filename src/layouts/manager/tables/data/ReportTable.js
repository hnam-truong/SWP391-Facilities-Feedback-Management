/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactDOM from 'react-dom';

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


export default function data() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [cateFilter, setCateFilter] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [timeExpireFilter, setTimeExpireFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showHelperFunction, setShowHelperFunction] = useState(false);

  const handleHelperFunctionClick = (feedback) => {
    setSelectedFeedback(feedback);
    setShowHelperFunction(true);
  };

  const handleAcceptReport = (feedbackId) => {
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
        // Find the feedback and set it to selectedFeedback
        const selectedFeedback = feedbacks.find(feedback => feedback.feedbackId === feedbackId);
        setSelectedFeedback(selectedFeedback);
        setDialogOpen(true);
        console.log(selectedFeedback)
        console.log('Setting dialogOpen to true');
      })
      .catch((error) => {
        console.error("Error: " + error.message);
      });
  };

  const handleRejectReport = (feedbackId) => {
    var option = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Rejected" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/RejectFeedback?feedbackId=" + feedbackId + "&response=" + feedbackId, option) //chỉnh response
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
    setOpen(true); // Show the popup
  }

  const RespondForm = () => {
    const handleClose = () => {
      setOpen(false);
    };
  }


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
          <IconButton onClick={() => { handleHelperFunctionClick(feedback); }}>
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
          {/* {feedback.status === "Processing" && (
            <div className="hover-content">
              {feedback.tasks
                .filter((task) => task.employee && task.employee.username)
                .map((task) => (
                  <p key={task.id}>
                    {task.employee.username || 'Unknown Employee'}
                  </p>
                ))
              }
            </div>
          )} */}
        </MDBox>
      ),
      time: <Time day={feedback.dateTime} />,
      action: (() => {
        switch (feedback.status) {
          case "Waiting":
            return (
              <div>
                <IconButton onClick={() => { handleHelperFunctionClick(feedback) }}>
                  <MDTypography component="a" variant="caption" color="success" fontWeight="medium">
                    Accept
                  </MDTypography>
                </IconButton>
                <IconButton onClick={() => handleRejectReport(feedback.feedbackId)}>
                  <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                    Reject
                  </MDTypography>
                </IconButton>
                <Dialog
                  open={showHelperFunction}
                  onClose={() => setShowHelperFunction(false)}
                  BackdropProps={{ style: { backgroundColor: 'transparent' } }}

                  maxWidth="80vw" // Make the dialog take up 80% of the viewport width
                  PaperProps={{ style: { maxHeight: '95vh', width: '40vw' } }} // Make the dialog take up 80% of the viewport height and width
                >
                  <HelperFunction selectedFeedback={selectedFeedback} />
                </Dialog>
              </div>
            );
          case "Processing":
            return (
              <div>
                <IconButton onClick={() => handleCancelReport(feedback.feedbackId)}>
                  <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
                    Cancel
                  </MDTypography>
                </IconButton>
              </div>
            );
          case "Responded":
            return (
              <div>
                <IconButton onClick={() => handleCloseReport(feedback.feedbackId)}>
                  <MDTypography component="a" variant="caption" color="info" fontWeight="medium">
                    Close
                  </MDTypography>
                </IconButton>
                {/* <IconButton onClick={() => { handleHelperFunctionClick(feedback); handleTaskReport(feedback.feedbackId) }}>
                  <MDTypography component="a" variant="caption" color="warning" fontWeight="medium">
                    Task
                  </MDTypography>
                </IconButton> */}
              </div>
            );
        }
      })(),
    }));


  return {
    columns: [
      { Header: (<RespondForm />), accessor: "star", align: "center", width: "0%", },
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
            status:{" "}
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