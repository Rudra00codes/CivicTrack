
import api from '../utils/api';
import { IIssue } from '../types';

/**
 * Fetches issues within a given radius of the provided latitude and longitude.
 * @param lat Latitude of the center point
 * @param lng Longitude of the center point
 * @param radius Radius in meters
 * @returns Promise resolving to an array of issues
 */
export const getIssues = (lat: number, lng: number, radius: number) => {
  return api.get<IIssue[]>('/issues', { params: { lat, lng, radius } });
};

/**
 * Fetches a single issue by ID
 * @param id Issue ID
 * @returns Promise resolving to an issue
 */
export const getIssueById = (id: string) => {
  return api.get<IIssue>(`/issues/${id}`);
};

/**
 * Creates a new issue
 * @param issueData Issue data to create
 * @returns Promise resolving to the created issue
 */
export const createIssue = (issueData: any) => {
  return api.post<IIssue>('/issues', issueData);
};

/**
 * Upvotes an issue
 * @param id Issue ID to upvote
 * @returns Promise resolving to the updated issue
 */
export const upvoteIssue = (id: string) => {
  return api.put<IIssue>(`/issues/${id}/upvote`);
};

/**
 * Reports an issue as spam or inappropriate
 * @param id Issue ID to report
 * @param reason Reason for reporting
 * @returns Promise resolving to success status
 */
export const reportIssue = (id: string, reason: string) => {
  return api.post(`/issues/${id}/report`, { reason });
};

/**
 * Admin: Fetches all flagged issues
 * @returns Promise resolving to an array of flagged issues
 */
export const getFlaggedIssues = () => {
  return api.get('/admin/issues/flagged');
};

/**
 * Admin: Approves a flagged issue
 * @param id Issue ID to approve
 * @returns Promise resolving to success status
 */
export const approveIssue = (id: string) => {
  return api.put(`/admin/issues/${id}/approve`);
};

/**
 * Admin: Rejects and removes a flagged issue
 * @param id Issue ID to reject
 * @returns Promise resolving to success status
 */
export const rejectIssue = (id: string) => {
  return api.delete(`/admin/issues/${id}`);
};

/**
 * Admin: Fetches admin statistics
 * @returns Promise resolving to admin stats
 */
export const getAdminStats = () => {
  return api.get('/admin/stats');
};

/**
 * Admin: Moderates an issue (approve/reject)
 * @param issueId Issue ID to moderate
 * @param action Action to take ('approve' | 'reject')
 * @param reason Optional reason for the action
 * @returns Promise resolving to success status
 */
export const moderateIssue = (issueId: string, action: 'approve' | 'reject', reason?: string) => {
  return api.put(`/admin/issues/${issueId}/moderate`, { action, reason });
};

/**
 * Admin: Deletes an issue permanently
 * @param issueId Issue ID to delete
 * @returns Promise resolving to success status
 */
export const deleteIssue = (issueId: string) => {
  return api.delete(`/admin/issues/${issueId}`);
};

/**
 * Admin: Bans a user
 * @param userId User ID to ban
 * @param reason Reason for banning
 * @param duration Duration in days (optional)
 * @returns Promise resolving to success status
 */
export const banUser = (userId: string, reason: string, duration?: number) => {
  return api.put(`/admin/users/${userId}/ban`, { reason, duration });
};
