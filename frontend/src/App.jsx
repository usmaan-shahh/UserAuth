import React from "react";
import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <div>
      <SignupPage />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<SignupPage />} />
      </Routes>
    </div>
  );
};

export default App;
