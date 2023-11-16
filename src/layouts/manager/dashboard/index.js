// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import React, { useState, useEffect } from "react";

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState("");
  const [bannedUsers, setBannedUsers] = useState("");
  const [feedbackCount, setFeedbackCount] = useState("");
  const [feedbackCountToday, setFeedbackCountToday] = useState("");
  const [usersProvidedFeedback, setUsersProvidedFeedback] = useState("");
  const [usersProvidedFeedbackToday, setUsersProvidedFeedbackToday] = useState("");
  const [feedbackClosed, setFeedbackClosed] = useState("");
  const [feedbackClosedToday, setFeedbackClosedToday] = useState("");
  const [dayChart, setDayChart] = useState([]);
  const [yearChart, setYearChart] = useState([]);
  const [userChart, setUserChart] = useState([]);

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return dd + '-' + mm + '-' + yyyy;
  }

  // Map the data to the desired format
  const labels = dayChart.map(item => item.date.substring(0, 3));
  const data = dayChart.map(item => item.amount);

  const labelsYear = yearChart.map(item => item.date.substring(5, 7));
  const dataYear = yearChart.map(item => item.amount);

  const labelsUser = userChart.map(item => item.date.substring(0, 3));
  const dataUser = userChart.map(item => item.amount);

  // Create the final object
  const resultOf7Day = {
    labels,
    datasets: { label: "Report", data }
  };

  const reportOfYear = {
    labels: labelsYear,
    datasets: { label: "Report", data: dataYear }
  };

  const reportOfUser = {
    labels: labelsUser,
    datasets: { label: "Report", data: dataUser }
  };

    useEffect(() => {
      fetch("https://localhost:7157/api/Feedbacks/CountLastYear")
        .then((response) => response.json())
        .then((data) => {
          // Update the state with the fetched data for last year's report count
          setYearChart(data);
        })
        .catch((error) => {
          console.error("Error fetching last year's report count:", error);
        });

      fetch("https://localhost:7157/api/Feedbacks/CountLastWeek")
        .then((response) => response.json())
        .then((data) => {
          // Update the state with the fetched data for last week's report count
          setDayChart(data);
        })
        .catch((error) => {
          console.error("Error fetching last week's report count:", error);
        });

        fetch("https://localhost:7157/api/Feedbacks/CountUser")
        .then((response) => response.json())
        .then((data) => {
          setUserChart(data);
        })
        .catch((error) => {
          console.error("Error fetching last year's report count:", error);
        });

      // Fetch data from the API
      fetch("https://localhost:7157/api/User/CountUserActive")
        .then((response) => response.json())
        .then((data) => {
          // Update the state with the fetched count
          setTotalUsers(data);
        })
        .catch((error) => {
          console.error("Error fetching user count:", error);
        });
      fetch("https://localhost:7157/api/User/CountUserBanned")
        .then((response) => response.json())
        .then((data) => {
          setBannedUsers(data);
        })
        .catch((error) => {
          console.error("Error fetching banned user count:", error);
        });

      fetch("https://localhost:7157/api/User/CountUserProvideFb")
        .then((response) => response.json())
        .then((data) => {
          setUsersProvidedFeedback(data);
        })
        .catch((error) => {
          console.error("Error fetching users providing feedback count:", error);
        });

      fetch("https://localhost:7157/api/User/CountUserProvideFbToday")
        .then((response) => response.json())
        .then((data) => {
          setUsersProvidedFeedbackToday(data);
        })
        .catch((error) => {
          console.error("Error fetching users providing feedback today count:", error);
        });

      fetch("https://localhost:7157/api/Feedbacks/CountFeedbackClosed")
        .then((response) => response.json())
        .then((data) => {
          setFeedbackClosed(data);
        })
        .catch((error) => {
          console.error("Error fetching count of all closed feedbacks:", error);
        });

      fetch("https://localhost:7157/api/Feedbacks/CountFeedbackClosedToday")
        .then((response) => response.json())
        .then((data) => {
          setFeedbackClosedToday(data);
        })
        .catch((error) => {
          console.error("Error fetching count of closed feedbacks today:", error);
        });

      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      fetch(
        `https://localhost:7157/api/Feedbacks/Count?beginDate=01-01-2023&endDate=${formattedDate}`
      )
        .then((response) => response.json())
        .then((data) => {
          setFeedbackCount(data);
        })
        .catch((error) => {
          console.error("Error fetching feedback count:", error);
        });

      fetch(
        `https://localhost:7157/api/Feedbacks/Count?beginDate=${formattedDate}&endDate=${formattedDate}`
      )
        .then((response) => response.json())
        .then((data) => {
          setFeedbackCountToday(data);
        })
        .catch((error) => {
          console.error("Error fetching feedback count:", error);
        });
    }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="table_view"
                title="Total Report"
                count={feedbackCount}
                percentage={{
                  color: "success",
                  amount: feedbackClosed + " Reports",
                  label: "were completed",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="add"
                title="Today's Reports"
                count={feedbackCountToday}
                percentage={{
                  color: "success",
                  amount: feedbackClosedToday + " Reports",
                  label: "were completed today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="person"
                title="Active User"
                count={totalUsers}
                percentage={{
                  color: "success",
                  amount: bannedUsers + " Users",
                  label: "were banned",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Users Created Reports"
                count={usersProvidedFeedback}
                percentage={{
                  color: "success",
                  amount: usersProvidedFeedbackToday + " Reports",
                  label: "today",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Reports in the last 7 days"
                  description=""
                  date="campaign sent 2 days ago"
                  chart={resultOf7Day}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Reports in the last 12 months"
                  description={
                    <>

                    </>
                  }
                  date="updated 4 min ago"
                  chart={reportOfYear}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="dark"
                  title="users created reports in the last 7 days"
                  description=""
                  date="just updated"
                  chart={reportOfUser}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;