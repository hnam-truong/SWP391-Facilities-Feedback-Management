/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
// import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import bgImage from "assets/images/HCM-scaled.jpeg";
import logo from "assets/images/logo-no-background.png";
import google from "assets/images/google-icon-2048x2048-czn3g8x8.png"

function Basic() {
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
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="FeID" label="FeID" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" fullWidth />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <Link to="/dashboard">
                <MDButton variant="gradient" color="info" fullWidth>
                  sign in
                </MDButton>
              </Link>
              {/* <MDButton variant="outline" style={{backgroundColor: '#5490F4'}} fullWidth> */}
              <GoogleLogin
                clientId="YOUR_GOOGLE_CLIENT_ID"
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    style={{ marginTop: '10px', width: '100%', height: '40px', borderStyle:'solid',borderColor:'#6e6e79', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e6e79', backgroundColor: '#ffff'}}
                  >
                    <img src={google} alt="google" style={{ width: '20px', height: 'auto', marginRight: '5px' }}></img>
                    <strong>SIGN IN WITH GOOGLE</strong>
                  </button>
                )}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
              />

              {/* </MDButton> */}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
