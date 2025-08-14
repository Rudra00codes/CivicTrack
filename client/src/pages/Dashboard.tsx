import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { getIssues } from "../services/issueService";
import { IIssue } from "../types";
import BackgroundWrapper from "../components/BackgroundWrapper";


/**
 * Dashboard page showing issues within a 5km radius of the user's location.
 * Issues can be filtered by status and category.
 * Features map view and distance-based filtering.
 */
const Dashboard = () => {
  const { user } = useUser();
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [userIssues, setUserIssues] = useState<IIssue[]>([]);
  const [filter, setFilter] = useState<'all' | 'my-issues'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [distanceFilter, setDistanceFilter] = useState<string>('5000'); // meters
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Refetch data when distance filter changes
    if (userLocation) {
      fetchDashboardData();
    }
  }, [distanceFilter]);

  /**
   * Fetches issues from the backend within specified distance of the user's location.
   * Falls back to default location if geolocation is unavailable.
   */
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(coords);
            
            // Fetch issues within specified distance of user's current location
            const { data } = await getIssues(
              coords.lat,
              coords.lng,
              parseInt(distanceFilter)
            );
            setIssues(data);
            setUserIssues(user ? data.filter((issue: any) => issue.user._id === user.id) : []);
          },
          () => {
            // Fallback: Use a default location (e.g., city center)
            const defaultCoords = { lat: 28.6139, lng: 77.2090 };
            setUserLocation(defaultCoords);
            getIssues(defaultCoords.lat, defaultCoords.lng, parseInt(distanceFilter)).then(({ data }) => {
              setIssues(data);
              setUserIssues(user ? data.filter((issue: any) => issue.user._id === user.id) : []);
            });
          }
        );
      } else {
        // Geolocation not supported
        const defaultCoords = { lat: 28.6139, lng: 77.2090 };
        setUserLocation(defaultCoords);
        getIssues(defaultCoords.lat, defaultCoords.lng, parseInt(distanceFilter)).then(({ data }) => {
          setIssues(data);
          setUserIssues(user ? data.filter((issue: any) => issue.user._id === user.id) : []);
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedIssues = filter === 'my-issues' ? userIssues : issues;

  const filteredIssues = displayedIssues.filter(issue => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <BackgroundWrapper variant="dots" className="py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </BackgroundWrapper>
      </div>
    );
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <BackgroundWrapper variant="dots" className="py-4">
      <div className="max-w-6xl mx-auto px-6 pt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300 drop-shadow-sm">Dashboard</h1>
        <p className="text-gray-300 max-w-2xl">
          Welcome back, {user?.fullName || 'User'}! Here's what's happening in your community.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Report New Issue</h3>
          <p className="text-blue-700 mb-4">Found a problem in your area?</p>
          <Link
            to="/report-issue"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Report Now
          </Link>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-green-900 mb-2">My Issues</h3>
          <p className="text-green-700 mb-4">{userIssues.length} issues reported</p>
          <button
            onClick={() => setFilter('my-issues')}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            View My Issues
          </button>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Community Issues</h3>
          <p className="text-purple-700 mb-4">{issues.length} issues nearby</p>
          <button
            onClick={() => setFilter('all')}
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            View All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">View:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'my-issues')}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Issues</option>
              <option value="my-issues">My Issues</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Lighting">Lighting</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Obstructions">Obstructions</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Distance:</label>
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1000">1 km</option>
              <option value="3000">3 km</option>
              <option value="5000">5 km</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">View Mode:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Map
                </span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredIssues.length} issues within {parseInt(distanceFilter)/1000}km
          </div>
        </div>
      </div>

      {/* Content Area - Grid or Map */}
      {viewMode === 'grid' ? (
        /* Issues Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div key={issue._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                {issue.images && issue.images.length > 0 && (
                  <img
                    src={issue.images[0]}
                    alt={issue.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{issue.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {issue.status}
                    </span>
                    <span className="text-sm text-gray-500">{issue.category}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    <span>👍 {issue.upvotes.length}</span>
                  </div>

                  <Link
                    to={`/issues/${issue._id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">
                {filter === 'my-issues' ? 'You haven\'t reported any issues yet.' : 'No issues found.'}
              </p>
              {filter === 'my-issues' && (
                <Link
                  to="/report-issue"
                  className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Report Your First Issue
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Map View */
        <div className="bg-white rounded-lg shadow">
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map View</h3>
              <p className="text-gray-500 mb-4">
                Map integration coming soon! This will show all {filteredIssues.length} issues as pins on an interactive map.
              </p>
              <div className="text-sm text-gray-400">
                Current location: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Loading...'}
              </div>
            </div>
          </div>
          
          {/* Map Legend */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Reported ({filteredIssues.filter(i => i.status === 'Reported').length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>In Progress ({filteredIssues.filter(i => i.status === 'In Progress').length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Resolved ({filteredIssues.filter(i => i.status === 'Resolved').length})</span>
                </div>
              </div>
              <div className="text-gray-500">
                Total: {filteredIssues.length} issues
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
  </BackgroundWrapper>
  </div>
  );
};

export default Dashboard;
