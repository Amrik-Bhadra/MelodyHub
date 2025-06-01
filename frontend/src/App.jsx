import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthLayout from "./layouts/AuthLayout";
import LoginForm from "./pages/auth/LoginForm";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./contexts/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import RegistrationForm from "./pages/auth/RegistrationForm";
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import InstructorQuizes from "./pages/instructor/InstructorQuizes";
import InstructorCourseDetail from "./pages/instructor/InstructorCourseDetail";

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/auth/login" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/instructor",
      element: (
        <ProtectedRoute>
          <InstructorLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/instructor",
          element: <InstructorDashboard />,
        },
        {
          path: "courses",
          element: <InstructorCourses />,
        },
        {
          path: "courses/:id",
          element: <InstructorCourseDetail/>
        },
        {
          path: "quizes",
          element: <InstructorQuizes />,
        },
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "register",
          element: <RegistrationForm />,
        },
        {
          path: "login",
          element: <LoginForm />,
        },
        {
          path: "verifyotp",
          element: <VerifyOTP />,
        },
        {
          path: "forgotpassword",
          element: <ForgetPassword />,
        },
        {
          path: "resetpassword",
          element: <ResetPassword />,
        },
      ],
    },
  ]);
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={routes} />
    </>
  );
}
