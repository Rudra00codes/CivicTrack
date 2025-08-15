import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import Loading from "./components/common/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/common/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  SignIn,
  SignUp,
  RedirectToSignIn,
  SignedOut,
} from "@clerk/clerk-react";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ReportIssue = lazy(() => import("./pages/ReportIssue"));
const IssueDetail = lazy(() => import("./pages/IssueDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider position="top-right" maxToasts={5}>
        <Router>
          <Suspense fallback={<Loading variant="spinner" />}>
            <Routes>
              {/* Auth Pages (without Layout) */}
              <Route
                path="/sign-in/*"
                element={
                  <SignedOut>
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/" />
                    </div>
                  </SignedOut>
                }
              />
              <Route
                path="/sign-up/*"
                element={
                  <SignedOut>
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/" />
                    </div>
                  </SignedOut>
                }
              />

              {/* All other routes with Layout wrapper */}
              <Route element={<Layout />}>
                {/* Public Route */}
                <Route path="/" element={<Home />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/report-issue" element={<ReportIssue />} />
                  <Route path="/issues/:id" element={<IssueDetail />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Route>

              {/* Fallback for unauthenticated users trying to access protected routes */}
              <Route 
                path="/protected/*" 
                element={
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;