import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Reported' | 'In Progress' | 'Resolved';
  location: string;
  reportedAt: string;
  imageUrl?: string;
  upvotes: number;
  distance: string;
}

const Dashboard = () => {
  const { user } = useUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<'all' | 'reported' | 'in-progress' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockIssues: Issue[] = [
      {
        id: '1',
        title: 'Pothole on Main Road',
        description: 'Large pothole causing traffic issues',
        category: 'Roads',
        status: 'Reported',
        location: 'Main Road, Near City Center',
        reportedAt: '2 hours ago',
        upvotes: 12,
        distance: '0.5 km'
      },
      {
        id: '2',
        title: 'Broken Street Light',
        description: 'Street light not working for 3 days',
        category: 'Lighting',
        status: 'In Progress',
        location: 'Park Avenue',
        reportedAt: '1 day ago',
        upvotes: 8,
        distance: '1.2 km'
      },
      {
        id: '3',
        title: 'Garbage Overflow',
        description: 'Overflowing garbage bin attracting pests',
        category: 'Cleanliness',
        status: 'Resolved',
        location: 'Market Street',
        reportedAt: '3 days ago',
        upvotes: 15,
        distance: '0.8 km'
      }
    ];
    setIssues(mockIssues);
  }, []);

  const filteredIssues = issues.filter(issue => {
    const statusMatch = filter === 'all' || issue.status.toLowerCase().replace(' ', '-') === filter;
    const categoryMatch = categoryFilter === 'all' || issue.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName || 'User'}! Here are the latest civic issues in your area.</p>
        </div>
        <Link
          to="/report-issue"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Report New Issue
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="reported">Reported</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Lighting">Lighting</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Public Safety">Public Safety</option>
          </select>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <Link
            key={issue.id}
            to={`/issues/${issue.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow border"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{issue.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded">{issue.category}</span>
                <span>{issue.distance}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{issue.location}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {issue.upvotes}
                  </span>
                  <span>{issue.reportedAt}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-600 mb-4">No civic issues match your current filters.</p>
          <Link
            to="/report-issue"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Report the first issue
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
