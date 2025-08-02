import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import IssueDetail from "./pages/IssueDetail";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes */}
        <Route
          path="/sign-in/*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
            </div>
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;