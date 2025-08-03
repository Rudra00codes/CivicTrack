import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import Loading from "./components/common/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/common/Toast";
import ConfigurationError from "./components/ConfigurationError";
import { auth } from "./config/firebase";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ReportIssue = lazy(() => import("./pages/ReportIssue"));
const IssueDetail = lazy(() => import("./pages/IssueDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  // Show configuration error if Firebase is not properly configured
  if (!auth) {
    return <ConfigurationError />;
  }

  return (
    <ErrorBoundary>
      <ToastProvider position="top-right" maxToasts={5}>
        <AuthProvider>
          <Router>
            <Suspense fallback={<Loading variant="spinner" />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/report-issue" element={<ReportIssue />} />
                  <Route path="/issues/:id" element={<IssueDetail />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;