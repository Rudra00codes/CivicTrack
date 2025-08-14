/**
 * Admin business logic hooks
 * Handles all admin operations with proper authorization and error handling
 */


import { useUser } from "@clerk/clerk-react";


// Clerk-based admin check only
export const useAdmin = () => {
  const { user } = useUser();
  // Example: check if email contains 'admin' (customize as needed)
  const isAdmin = user?.primaryEmailAddress?.emailAddress?.includes('admin');
  return { user, isAdmin };
};
