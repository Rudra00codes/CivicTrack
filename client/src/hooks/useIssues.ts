/**
 * Business logic hooks for issue management
 * Handles all issue-related operations with proper error handling and edge cases
 */

import { useState, useCallback } from 'react';
import { IIssue } from '../types';
import { getIssues, createIssue, reportIssue, upvoteIssue } from '../services/issueService';
import { locationUtils, Coordinates } from '../utils/locationUtils';
import { validators } from '../utils/validation';
import { errorHandler } from '../utils/errorHandler';

interface UseIssuesResult {
  issues: IIssue[];
  loading: boolean;
  error: string | null;
  fetchIssues: (location: Coordinates, radius: number) => Promise<void>;
  refreshIssues: () => Promise<void>;
  clearError: () => void;
}

interface UseIssueActionsResult {
  loading: boolean;
  error: string | null;
  createNewIssue: (issueData: any) => Promise<boolean>;
  reportAsSpam: (issueId: string, reason: string) => Promise<boolean>;
  upvote: (issueId: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Hook for managing issues data with location-based filtering
 */
export const useIssues = (): UseIssuesResult => {
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchParams, setLastFetchParams] = useState<{location: Coordinates, radius: number} | null>(null);

  const fetchIssues = useCallback(async (location: Coordinates, radius: number) => {
    // Validate input parameters
    const coordValidation = validators.coordinates(location.lat, location.lng);
    if (!coordValidation.isValid) {
      setError(coordValidation.errors.join(', '));
      return;
    }

    if (radius <= 0 || radius > 50000) { // Max 50km radius
      setError('Invalid radius. Must be between 1 and 50000 meters');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data } = await getIssues(location.lat, location.lng, radius);
      
      // Filter issues on client-side as backup (in case backend doesn't support it)
      const filteredIssues = locationUtils.filterByDistance(data || [], location, radius);
      
      setIssues(filteredIssues);
      setLastFetchParams({ location, radius });
      
      errorHandler.logError(new Error(`Fetched ${filteredIssues.length} issues`), 'Issues Fetch Success');
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      setIssues([]); // Clear issues on error
      errorHandler.logError(err, 'Issues Fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshIssues = useCallback(async () => {
    if (lastFetchParams) {
      await fetchIssues(lastFetchParams.location, lastFetchParams.radius);
    }
  }, [fetchIssues, lastFetchParams]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    issues,
    loading,
    error,
    fetchIssues,
    refreshIssues,
    clearError
  };
};

/**
 * Hook for issue actions (create, report, upvote)
 */
export const useIssueActions = (): UseIssueActionsResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewIssue = useCallback(async (issueData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      const titleValidation = validators.issueTitle(issueData.title);
      const descriptionValidation = validators.issueDescription(issueData.description);
      const categoryValidation = validators.issueCategory(issueData.category);

      const validationErrors = [
        ...titleValidation.errors,
        ...descriptionValidation.errors,
        ...categoryValidation.errors
      ];

      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return false;
      }

      // Validate location
      if (!issueData.location?.coordinates || issueData.location.coordinates.length !== 2) {
        setError('Valid location is required');
        return false;
      }

      const [lng, lat] = issueData.location.coordinates;
      const coordValidation = validators.coordinates(lat, lng);
      if (!coordValidation.isValid) {
        setError('Invalid location coordinates');
        return false;
      }

      // Validate images if provided
      if (issueData.images && issueData.images.length > 0) {
        // Note: This assumes images are File objects, adjust if they're already base64
        if (issueData.images.some((img: any) => img instanceof File)) {
          const imageValidation = validators.imageFiles(issueData.images);
          if (!imageValidation.isValid) {
            setError(imageValidation.errors.join(', '));
            return false;
          }
        }
      }

      await createIssue(issueData);
      return true;
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      errorHandler.logError(err, 'Issue Creation');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reportAsSpam = useCallback(async (issueId: string, reason: string): Promise<boolean> => {
    if (!issueId || !reason.trim()) {
      setError('Issue ID and reason are required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await reportIssue(issueId, reason.trim());
      return true;
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      errorHandler.logError(err, 'Issue Report');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const upvote = useCallback(async (issueId: string): Promise<boolean> => {
    if (!issueId) {
      setError('Issue ID is required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await upvoteIssue(issueId);
      return true;
    } catch (err: any) {
      const errorMessage = errorHandler.handleNetworkError(err);
      setError(errorMessage);
      errorHandler.logError(err, 'Issue Upvote');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createNewIssue,
    reportAsSpam,
    upvote,
    clearError
  };
};
