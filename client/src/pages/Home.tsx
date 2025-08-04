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
    <BackgroundWrapper variant="shader">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
          
          {/* Hero Card - Large */}
          <div className="lg:col-span-2 xl:col-span-3 lg:row-span-2 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
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
                  className="bg-white/90 backdrop-blur-sm text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-white hover:shadow-xl transition-all border border-white/60 shadow-lg flex items-center justify-center space-x-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Report Issue</span>
                </button>
                {!isSignedIn && (
                  <Link
                    to="/login"
                    className="bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/40 transition-all border border-white/40 shadow-lg"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* User Greeting Card - if signed in */}
          {isSignedIn && (
            <div className="lg:col-span-2 xl:col-span-2 bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
              {/* Authentication Status Demo - Integrated */}
              <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/60 rounded-lg p-3 mb-4">
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
              
              <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-4 border border-green-200/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-green-700 text-sm">Issues Reported</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-200/60">
                    <ChartBarIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search/Filter Card */}
          <div className={`${isSignedIn ? 'xl:col-span-1' : 'lg:col-span-2 xl:col-span-3'} bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl`}>
            {/* Authentication Status Demo - For non-signed in users */}
            {!isSignedIn && (
              <div className="bg-green-50/80 backdrop-blur-sm border border-green-200/60 rounded-lg p-3 mb-4">
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
                  className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg"
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
                  className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg"
                >
                  <option value="1000">1 km</option>
                  <option value="3000">3 km</option>
                  <option value="5000">5 km</option>
                  <option value="10000">10 km</option>
                </select>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:from-blue-700/90 hover:to-blue-800/90 transition-all border border-blue-500/40 shadow-lg">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="lg:col-span-2 xl:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-6 text-white relative overflow-hidden border border-white/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/60 to-teal-600/60 rounded-3xl"></div>
            <div className="relative z-10">
            <div className="absolute top-4 right-4">
              <ChartBarIcon className="h-8 w-8 text-white/50" />
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
            </div>

            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"></div>
          </div>

          {/* Map Card */}
          <div className="lg:col-span-2 xl:col-span-4 lg:row-span-1 bg-white/20 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/30 shadow-2xl">
            <div className="p-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Issues Near You</h3>
                </div>
                <span className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
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
          <div className="lg:col-span-2 xl:col-span-2 bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <ClockIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Recent Reports</h3>
            </div>

            <div className="space-y-4">
              {recentIssues.length > 0 ? (
                recentIssues.map((issue) => (
                  <div key={issue._id} className="flex items-start space-x-3 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
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
          <div className="lg:col-span-2 xl:col-span-2 bg-white/20 backdrop-blur-xl rounded-3xl p-6 text-gray-800 relative border border-white/30 shadow-2xl">
            <div className="relative z-10">
            <div className="absolute top-4 right-4">
              <UserGroupIcon className="h-8 w-8 text-gray-600/70" />
            </div>
            
            <h3 className="font-semibold mb-4 text-gray-800">Take Action</h3>
            
            <div className="space-y-3">
              <button
                onClick={navigateToReportIssue}
                className="block w-full bg-white/40 hover:bg-white/50 text-gray-800 py-3 px-4 rounded-xl font-medium text-center transition-all backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl"
              >
                Report New Issue
              </button>
              
              <Link
                to="/dashboard"
                className="block w-full bg-white/30 hover:bg-white/40 text-gray-800 py-3 px-4 rounded-xl font-medium text-center transition-all backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl"
              >
                View Dashboard
              </Link>
            </div>
            </div>
          </div>

          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default Home;
