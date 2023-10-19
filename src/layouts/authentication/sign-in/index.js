import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/HCM-scaled.jpeg";
import logo from "assets/images/logo-no-background.png";
import google from "assets/images/google-icon-2048x2048-czn3g8x8.png";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const onSuccess = (response) => {
    console.log('Login Success:', response);
    setIsLoggedIn(true);
  };

  const onFailure = (error) => {
    console.log('Login Failed:', error);
    setIsLoggedIn(false);
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox textAlign="center" mx={-1} mt={4} p={-3} mb={1}>
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
              <MDBox
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDBox>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <Link to="/dashboard">
                <MDButton variant="gradient" color="info" fullWidth>
                  sign in
                </MDButton>
              </Link>
              <GoogleLogin
                clientId="272487567848-t3fqoiu5r9bequdc4288fa5iruc3adig.apps.googleusercontent.com"
                onSuccess={onSuccess}
                onFailure={onFailure}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      height: "41px",
                      borderStyle: "solid",
                      borderColor: "#6e6e79",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6e6e79",
                      backgroundColor: "#ffff",
                    }}
                  >
                    <img
                      src={google}
                      alt="google"
                      style={{ width: "20px", height: "auto", marginRight: "5px" }}
                    />
                    <strong>SIGN IN WITH GOOGLE</strong>
                  </button>
                )}

              />
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;