/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

//MUI
import StarBorderIcon from "@mui/icons-material/StarBorder";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { createTheme } from "@mui/material/styles";
import SwitchStar from "./SwitchStar";

export default function data() {
  const badgeContent = "waiting"; // Replace this with the actual badge content
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Feedbacks";

    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
    .filter((feedback) => feedback.status === 2 || feedback.status === -1 || feedback.status === -2 ) // Filter out data that doesn't meet the condition
    .map((feedback) => ({
      noti: (
        <Box sx={{ mr: -3, ml: 0 }}>
          <SwitchStar />
        </Box>
      ),
      author: <Author name={feedback.userId} user={feedback.userId} />,
      title: <h4>{feedback.title}</h4>,
      info: <Info category={feedback.cateId} location={feedback.locationId} />,
      status: (
        <MDBox ml={-1}>
          {(() => {
            switch (feedback.status) {
              case 2:
                return (
                  <MDBadge badgeContent="closed" color="inherit" variant="gradient" size="sm" />
                );
              case -1:
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
    }));
    // action: (
    //   <div>
    //     <IconButton>
    //       <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
    //         Remove
    //       </MDTypography>
    //     </IconButton>
    //   </div>
    // ),

    // {
    //   Header: "",
    //   accessor: "checkBox",
    //   align: "right",
    //   width: "0%",
    // },
  return {
    columns: [
      { Header: "", accessor: "noti", align: "center", width: "0%" },
      { Header: "author", accessor: "author", align: "left" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "cat/loc", accessor: "info", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "time", accessor: "time", align: "center" },
      // { Header: "action", accessor: "action", align: "center" },
    ],

    rows: feedbackRows,
  };
}
