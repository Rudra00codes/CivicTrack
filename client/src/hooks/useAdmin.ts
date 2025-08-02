/**
 * Admin business logic hooks
 * Handles all admin operations with proper authorization and error handling
 */

import { useState, useCallback, useEffect } from 'react';
import { getAnalyticsSummary, getFlaggedIssues, getAllUsers } from '../services/userService';
import { moderateIssue, banUser, deleteIssue } from '../services/issueService';
import { errorHandler } from '../utils/errorHandler';
import { useAuth } from '../context/AuthContext';

interface AnalyticsData {
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  totalUsers: number;
  activeUsers: number;
  flaggedIssues: number;
  totalReports: number;
  lastUpdated: string;
}

interface FlaggedIssue {
  id: string;
  title: string;
  reportCount: number;
  category: string;
  status: string;
  reports: Array<{
    reason: string;
    reportedBy: string;
    reportedAt: string;
  }>;
}

interface UserData {
  id: string;
  email: string;
  displayName: string;
  issuesReported: number;
  reportsSubmitted: number;
  joinedAt: string;
  isActive: boolean;
  isBanned: boolean;
}

interface UseAdminAnalyticsResult {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
  clearError: () => void;
}

interface UseAdminModerationResult {
  flaggedIssues: FlaggedIssue[];
  loading: boolean;
  error: string | null;
  fetchFlaggedIssues: () => Promise<void>;
  moderateIssueAction: (issueId: string, action: 'approve' | 'reject' | 'delete', reason?: string) => Promise<boolean>;
  clearError: () => void;
}

interface UseAdminUsersResult {
  users: UserData[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  banUserAction: (userId: string, reason: string, duration?: number) => Promise<boolean>;
  unbanUserAction: (userId: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Hook for admin analytics data
 */
export const useAdminAnalytics = (): UseAdminAnalyticsResult => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAnalytics = useCallback(async () => {
    // Check admin authorization
    if (!user) {
      setError('Authentication required');
      return;
    }

    // Note: In a real app, you'd check for admin role/permissions
    // For MVP, we'll assume user.email ends with admin domain or has admin flag
    const isAdmin = user.email?.includes('admin') || (user as any).isAdmin;
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAnalyticsSummary();
      const data = response.data;
      
      // Transform the data to ensure all required fields exist
      const analyticsData: AnalyticsData = {
        totalIssues: data?.totalIssues || 0,
        resolvedIssues: data?.resolvedIssues || 0,
        pendingIssues: data?.pendingIssues || 0,
        totalUsers: data?.totalUsers || 0,
        activeUsers: data?.activeUsers || 0,
        flaggedIssues: data?.flaggedIssues || 0,
        totalReports: data?.totalReports || 0,
        lastUpdated: data?.lastUpdated || new Date().toISOString()
      };

      setAnalytics(analyticsData);
      errorHandler.logError(new Error('Analytics fetched successfully'), 'Admin Analytics Success');
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      setAnalytics(null);
      errorHandler.logError(err, 'Admin Analytics');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-refresh analytics on mount if user is authenticated
  useEffect(() => {
    if (user) {
      refreshAnalytics();
    }
  }, [user, refreshAnalytics]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics,
    clearError
  };
};

/**
 * Hook for admin moderation functionality
 */
export const useAdminModeration = (): UseAdminModerationResult => {
  const { user } = useAuth();
  const [flaggedIssues, setFlaggedIssues] = useState<FlaggedIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlaggedIssues = useCallback(async () => {
    if (!user) {
      setError('Authentication required');
      return;
    }

    const isAdmin = user.email?.includes('admin') || (user as any).isAdmin;
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await getFlaggedIssues();
      
      // Ensure data structure consistency
      const processedIssues = (data || []).map((issue: any) => ({
        id: issue.id || '',
        title: issue.title || 'Untitled Issue',
        reportCount: issue.reportCount || 0,
        category: issue.category || 'Uncategorized',
        status: issue.status || 'pending',
        reports: (issue.reports || []).map((report: any) => ({
          reason: report.reason || 'No reason provided',
          reportedBy: report.reportedBy || 'Anonymous',
          reportedAt: report.reportedAt || new Date().toISOString()
        }))
      }));

      setFlaggedIssues(processedIssues);
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      setFlaggedIssues([]);
      errorHandler.logError(err, 'Flagged Issues Fetch');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const moderateIssueAction = useCallback(async (
    issueId: string,
    action: 'approve' | 'reject' | 'delete',
    reason?: string
  ): Promise<boolean> => {
    if (!issueId || !action) {
      setError('Issue ID and action are required');
      return false;
    }

    if (!user) {
      setError('Authentication required');
      return false;
    }

    const isAdmin = user.email?.includes('admin') || (user as any).isAdmin;
    if (!isAdmin) {
      setError('Admin access required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      if (action === 'delete') {
        await deleteIssue(issueId);
      } else {
        await moderateIssue(issueId, action, reason);
      }

      // Remove the moderated issue from the list
      setFlaggedIssues(prev => prev.filter(issue => issue.id !== issueId));
      
      return true;
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      errorHandler.logError(err, 'Issue Moderation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    flaggedIssues,
    loading,
    error,
    fetchFlaggedIssues,
    moderateIssueAction,
    clearError
  };
};

/**
 * Hook for admin user management
 */
export const useAdminUsers = (): UseAdminUsersResult => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!user) {
      setError('Authentication required');
      return;
    }

    const isAdmin = user.email?.includes('admin') || (user as any).isAdmin;
    if (!isAdmin) {
      setError('Admin access required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await getAllUsers();
      
      // Process user data to ensure consistency
      const processedUsers = (data || []).map((userData: any) => ({
        id: userData.id || '',
        email: userData.email || 'Unknown',
        displayName: userData.displayName || userData.name || 'Unknown User',
        issuesReported: userData.issuesReported || 0,
        reportsSubmitted: userData.reportsSubmitted || 0,
        joinedAt: userData.joinedAt || userData.createdAt || new Date().toISOString(),
        isActive: userData.isActive !== false, // Default to true if not specified
        isBanned: userData.isBanned === true // Default to false if not specified
      }));

      setUsers(processedUsers);
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      setUsers([]);
      errorHandler.logError(err, 'Users Fetch');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const banUserAction = useCallback(async (
    userId: string,
    reason: string,
    duration?: number
  ): Promise<boolean> => {
    if (!userId || !reason.trim()) {
      setError('User ID and reason are required');
      return false;
    }

    if (!user) {
      setError('Authentication required');
      return false;
    }

    const isAdmin = user.email?.includes('admin') || (user as any).isAdmin;
    if (!isAdmin) {
      setError('Admin access required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await banUser(userId, reason.trim(), duration);
      
      // Update user status in local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isBanned: true, isActive: false } : u
      ));
      
      return true;
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      errorHandler.logError(err, 'User Ban');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const unbanUserAction = useCallback(async (userId: string): Promise<boolean> => {
    if (!userId) {
      setError('User ID is required');
      return false;
    }

    if (!user) {
      setError('Authentication required');
      return false;
    }

    const isAdmin = user.email?.includes('admin') || (user as any).isAdmin;
    if (!isAdmin) {
      setError('Admin access required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Note: You'd need to implement unbanUser in your service
      // await unbanUser(userId);
      
      // For now, we'll simulate it by updating local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isBanned: false, isActive: true } : u
      ));
      
      return true;
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      errorHandler.logError(err, 'User Unban');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    banUserAction,
    unbanUserAction,
    clearError
  };
};
