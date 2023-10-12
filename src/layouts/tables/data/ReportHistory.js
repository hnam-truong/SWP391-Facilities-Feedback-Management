/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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
import React from "react";
import ReactDOM from "react-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

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

  let action;

  if (badgeContent === "waiting") {
    action = (
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
    );
  } else if (badgeContent === "processing") {
    action = (
      <div>
        <IconButton>
          <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            Cancel
          </MDTypography>
        </IconButton>
      </div>
    );
  } else {
    action = (
      <div>
        <IconButton>
          <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
            Remove
          </MDTypography>
        </IconButton>
      </div>
    );
  }

  const Author = ({ /*image,*/ name, user }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      {/* <MDAvatar src={image} name={name} size="sm" /> */}
      <MDBox ml={/*2*/ 0} lineHeight={1}>
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

  return {
    columns: [
      {
        Header: "",
        accessor: "checkBox",
        align: "right",
        width: "0%",
      },
      { Header: "", accessor: "noti", align: "center", width: "0%" },
      { Header: "author", accessor: "author", align: "left" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "cat/loc", accessor: "info", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "time/expire", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        checkBox: (
          <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="" />
          </Box>
        ),
        noti: (
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="closed" color="inherit" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="closed" color="inherit" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="closed" color="inherit" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="closed" color="inherit" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="closed" color="inherit" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
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
          <Box sx={{ mr: 0, ml: -5 }}>
            <SwitchStar />
          </Box>
        ),
        author: <Author /*image={team2}*/ name="John Michael" user="Lecturer" />,
        title: <h4>Bàn bị hư hại</h4>,
        info: <Info category="Vật tư" location="NVH612" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="rejected" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        time: <Time day="11/01/19" expire="" />,
        action: (
          <div>
            <IconButton>
              <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                Remove
              </MDTypography>
            </IconButton>
          </div>
        ),
      },
    ],
  };
}
