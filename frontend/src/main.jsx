import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import React from "react";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route index element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/resetpassword" element={<ResetPasswordPage />} />
      <Route path="/verifyemail" element={<VerifyEmailPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
