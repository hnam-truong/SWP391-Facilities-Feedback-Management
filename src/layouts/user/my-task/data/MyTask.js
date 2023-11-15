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

export default function data() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Task/GetAllTask";
    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching data:", error));
      console.log(tasks);
  }, []);

  const taskRows = tasks
    .map((task) => ({
      manager: (
        <MDBox alignItems="center">
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {task.managerId}
          </MDTypography>
        </MDBox>
      ),
      employee: (
        <MDBox alignItems="center">
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {task.employeeId}
          </MDTypography>
        </MDBox>
      ),
      note: (
        <MDBox alignItems="center">
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {task.note}
          </MDTypography>
        </MDBox>
      ),
      status: (
        <MDBox ml={-1} className="status-cell">
          <MDBadge
            badgeContent={task.status}
            color="default"
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      responsed: (
        <MDBox alignItems="center">
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {task.responsed}
          </MDTypography>
        </MDBox>
      ),
      time: (
        <MDBox>
          <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
            {task.dateTime}
          </MDTypography>
        </MDBox>
      ),

    }));

  return {
    columns: [
      { Header: "", accessor: "space", align: "center", width: "0%" },
      { Header: "manager", accessor: "manager", align: "left" },
      { Header: "employee", accessor: "employee", align: "left" },
      // { Header: "title", accessor: "title", align: "left" },
      { Header: "note", accessor: "note", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "responsed", accessor: "responsed", align: "center" },
      { Header: "time", accessor: "time", align: "center" },
    ],

    rows: taskRows,
  };
}
