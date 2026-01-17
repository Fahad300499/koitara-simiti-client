import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Components/Home/Home";
import GoogleSignIn from "../pages/GoogleSignIn/GoogleSignIn";
import UserManagement from "../pages/UserManagement";
import ApprovePayment from "../pages/ApprovePayment";
import DashboardLayout from "./DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
        {
            path: "/",
            element: <Home></Home>
        }
    ]
  },
  {
    path:"/login",
    element: <GoogleSignIn></GoogleSignIn>
  },
 {
        path:'/dashboard',
        element: <DashboardLayout></DashboardLayout>,
        children: [ 
            {
                path: '/dashboard/approve-payment',
                element: <ApprovePayment></ApprovePayment>
            },
            {
                path: '/dashboard/users-management',
                element: <UserManagement></UserManagement>
            },
         
        ]
    }
]);

