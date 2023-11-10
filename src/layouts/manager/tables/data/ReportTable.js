/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import './ReportTable.css';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

//MUI
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
// import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import TextField from "@mui/material/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { set } from "react-hook-form";
import DialogActions from '@material-ui/core/DialogActions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Man } from "@mui/icons-material";


export default function data() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [catLocFilter, setCatLocFilter] = useState("All");
  const [timeExpireFilter, setTimeExpireFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [note, setNote] = useState('');


  const [selectedEmployee, setSelectedEmployee] = useState(null);

const handleEmployeeChange = (event) => {
  const selectedEmployeeId = event.target.value;
  const selectedEmployee = employees.find(employee => employee.userID === selectedEmployeeId);
  setSelectedEmployee(selectedEmployee);
};

const handleNoteChange = (event) => {
  setNote(event.target.value);
};

const handleAccept = async (FeedbackId, ManagerId, EmployeeId, Note) => {
  const formData = new FormData();
  formData.set('FeedbackId', FeedbackId);
  formData.set('ManagerId', ManagerId);
  formData.set('EmployeeId', EmployeeId);
  formData.set('Note', Note);

  try {
    const response = await fetch("https://localhost:7157/CreateTask?"
    +"FeedbackId="+ selectedFeedback.feedbackId
    +"&EmployeeId="+ selectedEmployee.userID
    +"&ManagerId="+ localStorage.getItem('userID')
    
    +"&Note="+ "messssi"
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


  const fetchEmployees = async (cateId) => {
    const response = await fetch(`https://localhost:7157/api/User/Employee/${cateId}`);
    const data = await response.json();
    setEmployees(data);
  }

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


  const MoreDetailsButton = ({ feedbackId }) => (
    <IconButton onClick={() => handleClickOpen(feedbackId)}>
      <VisibilityIcon fontSize="small" />
    </IconButton>
  );

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

    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
            <div>
            <table>
              <tbody>
                <tr>
                  <td><strong>Author:</strong></td>
                  <td>{selectedFeedback.user.username}</td>
                </tr>
                <tr>
                  <td><strong>Role:</strong></td>
                  <td>{selectedFeedback.user.role.description}</td>
                </tr>
                <tr>
                  <td><strong>Title:</strong></td>
                  <td>{selectedFeedback.title}</td>
                </tr>
                <tr>
                  <td><strong>Category:</strong></td>
                  <td>{selectedFeedback.cate.description}</td>
                </tr>
                <tr>
                  <td><strong>Description:</strong></td>
                  <td>{selectedFeedback.description}</td>
                </tr>
                <tr>
  <td><strong>Assignee:</strong></td>
  <td>
  <select onChange={handleEmployeeChange}>
  {employees.map(employee => (
    <option key={employee.userID} value={employee.userID}>
      {employee.username}
      
    </option>
  ))}
</select>
  </td>
</tr>
<tr>
  <td><strong>Note:</strong></td>
  <td>
    <textarea id="note" name="note" value={note} onChange={handleNoteChange}></textarea>
  </td>
</tr>
<tr>
  <td></td>
</tr>
                <tr>
                  <td><strong>Location:</strong></td>
                  <td>{selectedFeedback.locationId}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td>{selectedFeedback.status}</td>
                </tr>
                <tr>
                  <td><strong>Date/Time:</strong></td>
                  <td>{new Date(selectedFeedback.dateTime).toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: '2-digit' })}</td>
                </tr>
              </tbody>
            </table>
          </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            <button onClick={handleAccept} color="primary">
              Accept
              </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  useEffect(() => {
    if (selectedFeedback) {
      fetchEmployees(selectedFeedback.cate.id);
    }
  }, [selectedFeedback]);
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
  }, []);

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

  // const handleCatLocChange = (event) => {
  //   const catLoc = event.target.value;
  //   setCatLocFilter(catLoc);
  //   fetchData(`By${catLoc.charAt(0) + catLoc.slice(1)}`, catLoc);
  // };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    fetchData(`By${status.charAt(0) + status.slice(1)}`, status);
  };

  // const handleTimeExpireChange = (event) => {
  //   const timeExpire = event.target.value;
  //   setTimeExpireFilter(timeExpire);
  //   fetchData(`By${timeExpire.charAt(0) + timeExpire.slice(1)}`, timeExpire);
  // };

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
    setShowForm(true);
  }

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
      })
      .catch((error) => {
        console.error("Error: " + error.message);
      });
    setShowForm(true);
  }

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
    setShowForm(true);
  }


  const handleTaskReport = (feedbackId) => {
    // ... (existing code)
    // Set showForm to true when the Task button is clicked
    setShowForm(true);
  }

  const handleNoti = (feedbackId) => {
    fetch(
      `/Feedbacks/Notify?feedbackId=` + feedbackId,
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
    .filter((feedback) =>
      (feedback.status === "Waiting" || feedback.status === "Processing" || feedback.status === "Responded") &&
      (statusFilter === "All" || feedback.status === statusFilter)
    )
    .sort((a, b) => {
      return b.notify - a.notify || new Date(a.dateTime) - new Date(b.dateTime);
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
      title: <Link><h4 style={{ color: 'blue' }}>{feedback.title}</h4></Link>,
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
          {feedback.status === "Processing" && (
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
          )}
        </MDBox>
      ),
      time: <Time day={feedback.dateTime} /*expire="48 hours"*/ />,
      action: (() => {
        switch (feedback.status) {
          case "Waiting":
            return (
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
                <MoreDetailsButton feedbackId={feedback.feedbackId} />
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
                <MoreDetailsButton feedbackId={feedback.feedbackId} />
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
                <IconButton onClick={() => handleTaskReport(feedback.feedbackId)}>
                  <MDTypography component="a" variant="caption" color="warning" fontWeight="medium">
                    Task
                  </MDTypography>
                </IconButton>
                <MoreDetailsButton feedbackId={feedback.feedbackId} />
              </div>
            );
        }
      })(),
    }));


  return {
    columns: [
      { Header: (<RespondForm />), accessor: "star", align: "center", width: "0%" },
      { Header: "author", accessor: "author", align: "left" },
      {
        Header: "title",
        accessor: "title",
        align: "left",
      },
      {
        Header: (
          "cat/loc"
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
      { Header: "time/expire", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },

    ],

    rows: feedbackRows,

  };

}
