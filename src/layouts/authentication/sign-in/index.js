import React, { useState, useEffect } from 'react';
import { GoogleLogin } from "react-google-login";
// react-router-dom components
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

// import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import bgImage from "assets/images/HCM-scaled.jpeg";
import logo from "assets/images/logo-ct-blue.png";
import google from "assets/images/google-icon-2048x2048-czn3g8x8.png"

import axios from 'axios';

function Basic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    axios.get(
      `https://localhost:7157/api/User/Login?Email=` + localStorage.getItem('email') + '&Password=' + localStorage.getItem('password')
    )
      .then(response => {
        setUser(response.data); // Set the user state with the data from the response
      })
      .catch(error => {
        console.error('Error:', error);
      });
    if (user.role) {
      localStorage.setItem('userID', user.userID)
      console.log(user.role.description);
      switch (user.role.description) {
        case "Manager":
          navigate('/dashboard');
          break;

        case "Task Employee":
          navigate('/my-tasks');
          break;

        case "Student" || "Lecturer" || "Casual Employee":
          navigate('/my-reports');
          break;
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    axios.get(
      `https://localhost:7157/api/User/Login?Email=` + email + '&Password=' + password
    )
      .then(response => {
        setUser(response.data); // Set the user state with the data from the response
      })
      .catch(error => {
        console.error('Error:', error);
      });

    e.preventDefault();
    // Create a JSON object with user credentials
    const userData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post('https://localhost:7157/api/Authorize/GenerateToken', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const clientId = 'YOUR_CLIENT_ID';
  const [rememberMe, setRememberMe] = useState(false);
  const [logoPosition, setLogoPosition] = useState({ mx: -1, mt: 4, p: -3, mb: 1 });
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const onSuccess = (response) => {
    console.log('Login Success:', response);
  };

  const onFailure = (error) => {
    console.log('Login Failed:', error);
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          // variant="gradient"
          // bgColor="info"
          // borderRadius="lg"
          // coloredShadow="info"
          // mx={1}
          // mt={1}
          // p={-3}
          // mb={1}
          textAlign="center"
          {...logoPosition}
        >
          <img src={logo} alt="logo" style={{ width: "220px", height: "auto" }} />
        </MDBox>
        {/* <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={1}
          mt={1}
          p={-3}
          mb={1}
          pt={1}
          pb={1}
          color="white"
          fontWeight="bold"
          textAlign="center"
          {...logoPosition}
        >
          Login with FeID
        </MDBox> */}
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
              {/* <Link to="/dashboard"> */}
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                sign in
              </MDButton>
              {/* </Link> */}
              <MDBox
                alignItems="center"
                fontWeight="regular"
                color="text"
                textAlign="center"
                ml={-1}
                mt={3}>
                or
              </MDBox>
              <GoogleLogin
                clientId="YOUR_GOOGLE_CLIENT_ID"
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    style={{ marginTop: '10px', width: '100%', height: '40px', borderStyle: 'solid', borderColor: '#6e6e79', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e6e79', backgroundColor: '#ffff' }}
                  >
                    <img src={google} alt="google" style={{ width: '20px', height: 'auto', marginRight: '5px' }}></img>
                    <strong>SIGN IN WITH GOOGLE</strong>
                  </button>
                )}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
              />
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
