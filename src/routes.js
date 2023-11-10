// Material Dashboard 2 React layouts
import Dashboard from "layouts/manager/dashboard";
import ReportsTable from "layouts/manager/tables";
import ReportHistory from "layouts/manager/history";
import Notifications from "layouts/manager/notifications";
import Create from "layouts/user/create";
import SignIn from "layouts/authentication/sign-in";
import SignOut from "layouts/authentication/sign-out";
import UserReport from "layouts/user/my-report";
import EmployeeTask from "layouts/employee/my-task";
import Error404 from "layouts/error/error404";
import SystemHandler from "layouts/system-handler";

// @mui icons
import Icon from "@mui/material/Icon";


// const { user } = useUser();
// const userRole = user ? user.role.description : null;
const userRole = localStorage.getItem("userRole");

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ["Manager"],
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/reports",
    component: <ReportsTable />,
    roles: ["Manager"],
  },
  {
    type: "collapse",
    name: "History",
    key: "history",
    icon: <Icon fontSize="small">history</Icon>,
    route: "/history",
    component: <ReportHistory />,
    roles: ["Manager"],
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    roles: ["Manager"],
  },
  {
    type: "collapse",
    name: "My Reports",
    key: "my-reports",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/my-reports",
    component: <UserReport />,
    roles: ["Student", "Employee"],
  },
  {
    type: "collapse",
    name: "Create",
    key: "create",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/create",
    component: <Create />,
    roles: ["Student", "Lecturer", "Manager"],
  },
  {
    type: "collapse",
    name: "My Tasks",
    key: "my-tasks",
    icon: <Icon fontSize="small">task</Icon>,
    route: "/my-tasks",
    component: <EmployeeTask />,
    roles: ["Employee", "Manager"]
  },
  {
    type: "collapse",
    name: "System Handler",
    key: "system-handler",
    icon: <Icon fontSize="small">system</Icon>,
    route: "/system-handler",
    component: <SystemHandler />,
    roles: ["System Handler", "Manager"]
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/sign-out",
    component: <SignOut />,
  },
  {
    type: "hidden",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/sign-in",
    component: <SignIn />,
  },
  {
    type: "route",
    route: "*",
    component: <Error404 />,
  },
].filter((route) => {
  return route.roles ? route.roles.includes(userRole) : true;
});

export default routes;