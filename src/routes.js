// Material Dashboard 2 React layouts
import Dashboard from "layouts/manager/dashboard";
import ReportsTable from "layouts/manager/tables";
import ReportHistory from "layouts/manager/history";
import Notifications from "layouts/manager/notifications";
import Create from "layouts/create";
import SignIn from "layouts/authentication/sign-in";
import SignOut from "layouts/authentication/sign-out";
import UserReport from "layouts/user/my-report";
import EmployeeTask from "layouts/employee/my-task";;

// @mui icons
import Icon from "@mui/material/Icon";
import { layouts } from "chart.js";

const routes = [
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
    name: "Sign In",
    key: "sign-in", 
    icon: <Icon fontSize="small">login</Icon>,
    route: "/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "My Reports",
    key: "my-reports",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/my-reports",
    component: <UserReport />,
  },
  {
    type: "collapse",
    name: "Create",
    key: "create",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/create",
    component: <Create />,
  },
  {
    type: "collapse",
    name: "My Tasks",
    key: "my-tasks",
    icon: <Icon fontSize="small">task</Icon>,
    route: "/my-tasks",
    component: <EmployeeTask />,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out", 
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/sign-out",
    component: <SignOut />,
  },

];

export default routes;
