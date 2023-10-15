import React, { useState, useEffect } from 'react';

function FeedbacksComponent() {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        // Define the URL of your API endpoint
        const apiUrl = 'https://localhost:7157/api/Feedbacks';

        // Make a GET request to your API endpoint
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => setFeedbacks(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Feedbacks</h1>
            <ul>
                {feedbacks.map((feedback) => (
                    <li key={feedback.feedbackId}>
                        <p>Title: {feedback.title}</p>
                        <p>Description: {feedback.description}</p>
                        <p>Category ID: {feedback.cateId}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FeedbacksComponent;

{
    checkBox: (
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        <FormControlLabel control={<Checkbox defaultChecked />} label="" />
      </Box>
    ),
    noti: (
      <Box sx={{ mr: -3, ml: 0 }}>
        <SwitchStar />
      </Box>
    ),
    author: <Author name="John Michael" user="Lecturer" />,
    title: <h4>Bàn bị hư hại</h4>,
    info: <Info category="Vật tư" location="NVH612" />,
    status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent="waiting" color="light" variant="gradient" size="sm" />
      </MDBox>
    ),
    time: <Time day="11/01/19" expire="48 hours" />,
    action: (
      <div>
        <IconButton>
          <MDTypography component="a" variant="caption" color="success" fontWeight="medium">
            Accept
          </MDTypography>
        </IconButton>
        <IconButton>
          <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
            Reject
          </MDTypography>
        </IconButton>
      </div>
    ),
  },
  {
    checkBox: (
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        <FormControlLabel control={<Checkbox defaultChecked />} label="" />
      </Box>
    ),
    noti: (
      <Box sx={{ mr: -3, ml: 0 }}>
        <SwitchStar />
      </Box>
    ),
    author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
    title: <h4>Bàn bị hư hại</h4>,
    info: <Info category="Vật tư" location="NVH612" />,
    status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent="processing" color="warning" variant="gradient" size="sm" />
      </MDBox>
    ),
    time: <Time day="11/01/19" expire="" />,
    action: (
      <div>
        <IconButton>
          <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            Cancel
          </MDTypography>
        </IconButton>
      </div>
    ),
  },


  status: (
    <MDBox ml={-1}>
      <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
    </MDBox>
  ),

  status: (
    <MDBox ml={-1}>
      <MDBadge badgeContent="closed" color="inherit" variant="gradient" size="sm" />
    </MDBox>
  ),