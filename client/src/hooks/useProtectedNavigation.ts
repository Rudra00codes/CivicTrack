import { useNavigate } from 'react-router-dom';
// Clerk handles auth, no need for useAuth

export const useProtectedNavigation = () => {
  const navigate = useNavigate();

  // This hook should not handle Clerk state directly. Navigation logic should be handled in components using Clerk hooks.
  const navigateToProtectedRoute = (route: string) => {
    navigate(route);
  };

  const navigateToReportIssue = () => {
    navigateToProtectedRoute('/report-issue');
  };

  const navigateToDashboard = () => {
    navigateToProtectedRoute('/dashboard');
  };

  return {
    navigateToProtectedRoute,
    navigateToReportIssue,
    navigateToDashboard
  };
};
