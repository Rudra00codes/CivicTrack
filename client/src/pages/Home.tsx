import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';
import { useProtectedNavigation } from '../hooks/useProtectedNavigation';
import BackgroundWrapper from '../components/BackgroundWrapper';
import { 
  MapPinIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Home = () => {
  const { isSignedIn, user } = useAuth();
  const { navigateToReportIssue } = useProtectedNavigation();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    distance: '5000'
  });

  // Use modular hooks
  const { 
    issues, 
    loading, 
    fetchIssues: fetchIssuesHook
  } = useIssues();

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchIssues();
    }
  }, [userLocation, filters]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a central location if geolocation fails
          setUserLocation([40.7128, -74.0060]); // New York coordinates as fallback
        }
      );
    } else {
      // Default location if geolocation is not supported
      setUserLocation([40.7128, -74.0060]);
    }
  };

  const fetchIssues = async () => {
    if (!userLocation) return;
    
    const [lat, lng] = userLocation;
    const radius = parseInt(filters.distance);
    
    await fetchIssuesHook({ lat, lng }, radius);
  };

  // Mock statistics for demo
  const stats = {
    totalIssues: issues.length || 1247,
    resolvedIssues: Math.floor((issues.length || 1247) * 0.68),
    activeReports: Math.floor((issues.length || 1247) * 0.24),
    communities: 45
  };

  const recentIssues = issues.slice(0, 3);

  if (loading) {
    return (
      <BackgroundWrapper variant="dots">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your community dashboard...</p>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper variant="grid">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
          
          {/* Hero Card - Large */}
          <div className="lg:col-span-2 xl:col-span-3 lg:row-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  CivicTrack
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                Building Better Communities Together
              </h1>
              
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                Report civic issues, track progress, and help make your neighborhood a better place to live.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={navigateToReportIssue}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Report Issue</span>
                </button>
                {!isSignedIn && (
                  <Link
                    to="/login"
                    className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-white/5 rounded-full"></div>
          </div>

          {/* User Greeting Card - if signed in */}
          {isSignedIn && (
            <div className="lg:col-span-2 xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border">
              {/* Authentication Status Demo - Integrated */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-green-800 text-sm mb-1">
                  🔐 Authentication Status: ✅ Signed In
                </h4>
                <div className="text-green-700 text-xs">
                  <p><strong>User ID:</strong> {user?.uid}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Display Name:</strong> {user?.displayName || 'Not set'}</p>
                  <div className="mt-1 p-2 bg-green-100 rounded text-xs">
                    ✅ You can now click "Report Issue" to go directly to the report page!
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hello, {user?.email?.split('@')[0] || 'User'}!</h3>
                  <p className="text-gray-500 text-sm">Welcome back to CivicTrack</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-green-700 text-sm">Issues Reported</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ChartBarIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search/Filter Card */}
          <div className={`${isSignedIn ? 'xl:col-span-1' : 'lg:col-span-2 xl:col-span-3'} bg-white rounded-3xl p-6 shadow-sm border`}>
            {/* Authentication Status Demo - For non-signed in users */}
            {!isSignedIn && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-green-800 text-sm mb-1">
                  🔐 Authentication Status: ❌ Not Signed In
                </h4>
                <div className="text-green-700 text-xs">
                  <p>Click "Report Issue" to test the authentication flow:</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    <li>You'll be redirected to the login page</li>
                    <li>After signing in, you'll return to the Report Issue page</li>
                    <li>Test credentials: john@example.com / password123</li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 mb-4">
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={filters.category} 
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Roads">Roads</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Obstructions">Obstructions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                <select 
                  value={filters.distance} 
                  onChange={(e) => setFilters({...filters, distance: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1000">1 km</option>
                  <option value="3000">3 km</option>
                  <option value="5000">5 km</option>
                  <option value="10000">10 km</option>
                </select>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="lg:col-span-2 xl:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <ChartBarIcon className="h-8 w-8 text-white/30" />
            </div>
            
            <h3 className="font-semibold mb-6 text-emerald-100">Community Impact</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold">{stats.totalIssues.toLocaleString()}</p>
                <p className="text-emerald-200 text-sm">Total Reports</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.resolvedIssues.toLocaleString()}</p>
                <p className="text-emerald-200 text-sm">Resolved</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeReports}</p>
                <p className="text-emerald-200 text-sm">Active Reports</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.communities}</p>
                <p className="text-emerald-200 text-sm">Communities</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full"></div>
          </div>

          {/* Map Card */}
          <div className="lg:col-span-2 xl:col-span-4 lg:row-span-1 bg-white rounded-3xl overflow-hidden shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Issues Near You</h3>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {issues.length} found
                </span>
              </div>
            </div>
            
            <div style={{ height: '300px' }}>
              {userLocation ? (
                <MapContainer 
                  center={userLocation} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {issues.map((issue) => (
                    <Marker 
                      key={issue._id} 
                      position={[issue.location.coordinates[1], issue.location.coordinates[0]]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{issue.title}</h3>
                          <p className="text-sm text-gray-600">{issue.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                              issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {issue.status}
                            </span>
                            <span className="text-xs text-gray-500">{issue.category}</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MapPinIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Issues Card */}
          <div className="lg:col-span-2 xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <ClockIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Recent Reports</h3>
            </div>

            <div className="space-y-4">
              {recentIssues.length > 0 ? (
                recentIssues.map((issue) => (
                  <div key={issue._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-2xl">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      issue.status === 'Resolved' ? 'bg-green-500' :
                      issue.status === 'In Progress' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{issue.title}</p>
                      <p className="text-gray-500 text-xs">{issue.category}</p>
                      <p className="text-gray-400 text-xs">{new Date(issue.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500 text-sm">No recent reports</p>
                </div>
              )}
              
              <Link
                to="/dashboard"
                className="block w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
              >
                View All Reports →
              </Link>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="lg:col-span-2 xl:col-span-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <UserGroupIcon className="h-8 w-8 text-white/30" />
            </div>
            
            <h3 className="font-semibold mb-4 text-purple-100">Take Action</h3>
            
            <div className="space-y-3">
              <button
                onClick={navigateToReportIssue}
                className="block w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl font-medium text-center transition-colors backdrop-blur-sm"
              >
                Report New Issue
              </button>
              
              <Link
                to="/dashboard"
                className="block w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium text-center transition-colors backdrop-blur-sm"
              >
                View Dashboard
              </Link>
            </div>

            <div className="absolute -bottom-4 -left-4 h-20 w-20 bg-white/10 rounded-full"></div>
          </div>

          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default Home;
