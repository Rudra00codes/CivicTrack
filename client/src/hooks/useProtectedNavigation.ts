import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  const navigateToProtectedRoute = (
    route: string, 
    redirectAfterAuth?: string
  ) => {
    if (!isLoaded) {
      // Auth is still loading, wait before making decision
      return;
    }

    if (isSignedIn) {
      // User is authenticated, navigate to the requested route
      navigate(route);
    } else {
      // User is not authenticated, redirect to login/register with return URL
      const returnUrl = redirectAfterAuth || route;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
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
    navigateToDashboard,
    isSignedIn,
    isLoaded
  };
};
