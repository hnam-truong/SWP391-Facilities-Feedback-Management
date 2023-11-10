import React, { useState, useEffect } from 'react';
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

import bgImage from "assets/images/HCM-scaled.jpeg";
import logo from "assets/images/logo-ct-blue.png";
import google from "assets/images/google-icon-2048x2048-czn3g8x8.png"

import axios from 'axios';
const API_URL = 'https://localhost:7157/api/User/Login';

function Basic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});
  const logoPosition = { mx: -1, mt: 4, p: -3, mb: 1 };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}?Email=${localStorage.getItem('email')}&Password=${localStorage.getItem('password')}`);
        setUser(response.data);
        if (response.data.role) {
          localStorage.setItem('userID', response.data.userID);
          localStorage.setItem('userRole', response.data.role.description);
          localStorage.setItem('isAuthenticated', true);
          navigateBasedOnRole(response.data.role.description);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchUser();
  }, []);

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case "Manager":
        navigate('/dashboard');
        break;
      case "Employee":
        navigate('/my-tasks');
        break;
      case "Student":
      case "Lecturer":
        navigate('/my-reports');
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_URL}?Email=${email}&Password=${password}`);
      if (response.data.email === email && response.data.password === password) {
        setUser(response.data);
        localStorage.setItem('userID', response.data.userID);
        localStorage.setItem('userRole', response.data.role.description);
        localStorage.setItem('isAuthenticated', true);
        navigateBasedOnRole(response.data.role.description);
        console.log('User:', response.data.role.description);
        
      } else {
        console.error('Email or password is incorrect');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
     
          textAlign="center"
          {...logoPosition}
        >
          <img src={logo} alt="logo" style={{ width: "220px", height: "auto" }} />
        </MDBox>
      
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth >
                sign in
              </MDButton>
              <MDBox
                alignItems="center"
                fontWeight="regular"
                color="text"
                textAlign="center"
                ml={-1}
                mt={3}>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

