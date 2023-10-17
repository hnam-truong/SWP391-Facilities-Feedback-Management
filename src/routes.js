// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import ReportsTable from "layouts/tables";
import ReportHistory from "layouts/history";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import { layouts } from "chart.js";

const routes = [
   {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/reports",
    component: <ReportsTable />,
  },
  {
    type: "collapse",
    name: "History",
    key: "history",
    icon: <Icon fontSize="small">history</Icon>,
    route: "/history",
    component: <ReportHistory />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
 
];
const isSignedIn = localStorage.getItem("token");
// If the user is signed in, hide the "Sign In" link
if (isSignedIn) {
  routes.splice(0, 1);
}

export default routes;
