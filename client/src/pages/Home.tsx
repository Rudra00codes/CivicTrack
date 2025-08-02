import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';
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
  const { isSignedIn } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
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
          console.error("Error getting user location", error);
          // Default location (London) if user denies permission
          setUserLocation([51.505, -0.09]);
        }
      );
    } else {
      // Default location if geolocation is not supported
      setUserLocation([51.505, -0.09]);
    }
  };

  const fetchIssues = async () => {
    if (!userLocation) return;
    
    const [lat, lng] = userLocation;
    const radius = parseInt(filters.distance);
    
    await fetchIssuesHook({ lat, lng }, radius);
  };

  const filteredIssues = issues.filter(issue => {
    if (filters.category && issue.category !== filters.category) return false;
    if (filters.status && issue.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center my-8">Welcome to CivicTrack</h1>
        <p className="text-center text-gray-600 mb-8">
          Report and track local civic issues in your community
        </p>

        {!isSignedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Join CivicTrack Today</h2>
            <p className="text-blue-700 mb-4">
              Sign up to report issues, track progress, and help improve your community
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Filters and View Toggle */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <select 
                value={filters.category} 
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Categories</option>
                <option value="Roads">Roads</option>
                <option value="Lighting">Lighting</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Obstructions">Obstructions</option>
              </select>

              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="Reported">Reported</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select 
                value={filters.distance} 
                onChange={(e) => setFilters({...filters, distance: e.target.value})}
                className="px-3 py-2 border rounded-md"
              >
                <option value="1000">1 km</option>
                <option value="3000">3 km</option>
                <option value="5000">5 km</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`px-4 py-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Grid View
              </button>
              <button 
                onClick={() => setViewMode('map')} 
                className={`px-4 py-2 rounded-md ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Map View
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading issues...</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <div key={issue._id} className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                      {issue.images && issue.images.length > 0 && (
                        <img 
                          src={issue.images[0]} 
                          alt={issue.title}
                          className="w-full h-48 object-cover rounded mb-3"
                        />
                      )}
                      <h2 className="text-xl font-bold mb-2">{issue.title}</h2>
                      <p className="text-gray-600 mb-2">{issue.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-sm ${
                          issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {issue.status}
                        </span>
                        <span className="text-sm text-gray-500">{issue.category}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No issues found in your area.</p>
                  </div>
                )}
              </div>
            ) : (
              userLocation && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <MapContainer 
                    center={userLocation} 
                    zoom={13} 
                    style={{ height: '500px', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredIssues.map((issue) => (
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
                </div>
              )
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
