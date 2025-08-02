import api from '../utils/api';

/**
 * Admin: Fetches all users
 * @returns Promise resolving to an array of users
 */
export const getUsers = () => {
  return api.get('/admin/users');
};

/**
 * Admin: Bans a user
 * @param userId User ID to ban
 * @returns Promise resolving to success status
 */
export const banUser = (userId: string) => {
  return api.put(`/admin/users/${userId}/ban`);
};

/**
 * Admin: Unbans a user
 * @param userId User ID to unban
 * @returns Promise resolving to success status
 */
export const unbanUser = (userId: string) => {
  return api.delete(`/admin/users/${userId}/ban`);
};

/**
 * Admin: Gets user activity and statistics
 * @param userId User ID
 * @returns Promise resolving to user statistics
 */
export const getUserStats = (userId: string) => {
  return api.get(`/admin/users/${userId}/stats`);
};

/**
 * Admin: Gets analytics summary for dashboard
 * @returns Promise resolving to analytics data
 */
export const getAnalyticsSummary = () => {
  return api.get('/admin/analytics');
};

/**
 * Admin: Gets all flagged issues
 * @returns Promise resolving to flagged issues
 */
export const getFlaggedIssues = () => {
  return api.get('/admin/issues/flagged');
};

/**
 * Admin: Gets all users (alias for getUsers for consistency)
 * @returns Promise resolving to all users
 */
export const getAllUsers = () => {
  return getUsers();
};
