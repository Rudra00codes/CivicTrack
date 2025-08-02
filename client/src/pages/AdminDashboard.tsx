import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface AdminStats {
  totalIssues: number;
  flaggedIssues: number;
  resolvedIssues: number;
  activeUsers: number;
  categoryStats: { [key: string]: number };
}

interface FlaggedIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  reportedBy: string;
  flaggedCount: number;
  flagReasons: string[];
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  issuesReported: number;
  flaggedCount: number;
  isBanned: boolean;
  joinedAt: string;
}

/**
 * Admin Dashboard for managing civic issues, analytics, and users
 * Features: Issue management, analytics, user moderation
 */
const AdminDashboard = () => {
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState<'analytics' | 'issues' | 'users'>('analytics');
  const [stats, setStats] = useState<AdminStats>({
    totalIssues: 0,
    flaggedIssues: 0,
    resolvedIssues: 0,
    activeUsers: 0,
    categoryStats: {}
  });
  const [flaggedIssues, setFlaggedIssues] = useState<FlaggedIssue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin (in production, check user role from backend)
    if (!isSignedIn || !user?.email?.includes('admin')) {
      navigate('/dashboard');
      return;
    }
    
    fetchAdminData();
  }, [isSignedIn, user, navigate]);

  /**
   * Fetches all admin data including stats, flagged issues, and users
   */
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Mock data for MVP - replace with actual API calls
      await Promise.all([
        fetchStats(),
        fetchFlaggedIssues(),
        fetchUsers()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches analytics and statistics
   */
  const fetchStats = async () => {
    // Mock data - replace with actual API call
    const mockStats: AdminStats = {
      totalIssues: 245,
      flaggedIssues: 12,
      resolvedIssues: 189,
      activeUsers: 156,
      categoryStats: {
        'Roads': 89,
        'Lighting': 45,
        'Water Supply': 34,
        'Cleanliness': 28,
        'Public Safety': 31,
        'Obstructions': 18
      }
    };
    setStats(mockStats);
  };

  /**
   * Fetches issues flagged as spam or inappropriate
   */
  const fetchFlaggedIssues = async () => {
    // Mock data - replace with actual API call
    const mockFlaggedIssues: FlaggedIssue[] = [
      {
        id: '1',
        title: 'Fake pothole report',
        description: 'This is clearly spam content...',
        category: 'Roads',
        reportedBy: 'user123@email.com',
        flaggedCount: 5,
        flagReasons: ['Spam', 'False information', 'Inappropriate content'],
        status: 'Reported',
        createdAt: '2025-08-01T10:30:00Z'
      },
      {
        id: '2',
        title: 'Inappropriate language in description',
        description: 'Contains offensive content...',
        category: 'Public Safety',
        reportedBy: 'user456@email.com',
        flaggedCount: 3,
        flagReasons: ['Offensive content', 'Inappropriate language'],
        status: 'Under Review',
        createdAt: '2025-08-01T14:20:00Z'
      }
    ];
    setFlaggedIssues(mockFlaggedIssues);
  };

  /**
   * Fetches user data for moderation
   */
  const fetchUsers = async () => {
    // Mock data - replace with actual API call
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'user123@email.com',
        displayName: 'John Doe',
        issuesReported: 23,
        flaggedCount: 2,
        isBanned: false,
        joinedAt: '2025-07-15T09:00:00Z'
      },
      {
        id: '2',
        email: 'user456@email.com',
        displayName: 'Jane Smith',
        issuesReported: 8,
        flaggedCount: 5,
        isBanned: false,
        joinedAt: '2025-07-20T11:30:00Z'
      }
    ];
    setUsers(mockUsers);
  };

  /**
   * Handles approval of flagged issues
   */
  const handleApproveIssue = async (issueId: string) => {
    try {
      // API call to approve issue
      console.log(`Approving issue ${issueId}`);
      setFlaggedIssues(prev => prev.filter(issue => issue.id !== issueId));
      alert('Issue approved successfully');
    } catch (error) {
      console.error('Error approving issue:', error);
      alert('Failed to approve issue');
    }
  };

  /**
   * Handles rejection/removal of flagged issues
   */
  const handleRejectIssue = async (issueId: string) => {
    try {
      // API call to reject/remove issue
      console.log(`Rejecting issue ${issueId}`);
      setFlaggedIssues(prev => prev.filter(issue => issue.id !== issueId));
      alert('Issue rejected and removed');
    } catch (error) {
      console.error('Error rejecting issue:', error);
      alert('Failed to reject issue');
    }
  };

  /**
   * Handles user ban/unban actions
   */
  const handleToggleUserBan = async (userId: string, shouldBan: boolean) => {
    try {
      // API call to ban/unban user
      console.log(`${shouldBan ? 'Banning' : 'Unbanning'} user ${userId}`);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isBanned: shouldBan } : user
      ));
      alert(`User ${shouldBan ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      console.error('Error updating user ban status:', error);
      alert('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage issues, view analytics, and moderate users
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.displayName || user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'analytics', name: 'Analytics', icon: '📊' },
              { id: 'issues', name: 'Flagged Issues', icon: '🚩' },
              { id: 'users', name: 'User Management', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Issues
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalIssues}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🚩</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Flagged Issues
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.flaggedIssues}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Resolved Issues
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.resolvedIssues}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.activeUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Statistics */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Most Reported Categories
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(stats.categoryStats)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {category}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(count / Math.max(...Object.values(stats.categoryStats))) * 100}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Flagged Issues ({flaggedIssues.length})
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Review and manage issues flagged by users
                </p>
              </div>
              
              {flaggedIssues.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No flagged issues to review</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {flaggedIssues.map((issue) => (
                    <div key={issue.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-gray-900">
                              {issue.title}
                            </h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {issue.flaggedCount} flags
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              issue.status === 'Under Review' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {issue.status}
                            </span>
                          </div>
                          
                          <p className="mt-2 text-sm text-gray-600">
                            {issue.description}
                          </p>
                          
                          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Category: {issue.category}</span>
                            <span>Reported by: {issue.reportedBy}</span>
                            <span>Date: {new Date(issue.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Flag reasons: </span>
                            <span className="text-sm text-gray-600">
                              {issue.flagReasons.join(', ')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex space-x-3">
                          <button
                            onClick={() => handleApproveIssue(issue.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectIssue(issue.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  User Management ({users.length})
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Monitor and moderate user accounts
                </p>
              </div>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issues Reported
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flagged Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.displayName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.displayName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.issuesReported}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.flaggedCount > 3 
                              ? 'bg-red-100 text-red-800'
                              : user.flaggedCount > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.flaggedCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isBanned 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleToggleUserBan(user.id, !user.isBanned)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md ${
                              user.isBanned
                                ? 'text-green-700 bg-green-100 hover:bg-green-200'
                                : 'text-red-700 bg-red-100 hover:bg-red-200'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
