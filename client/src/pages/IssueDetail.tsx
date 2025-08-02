import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Reported' | 'In Progress' | 'Resolved';
  location: string;
  reportedAt: string;
  reportedBy: string;
  isAnonymous: boolean;
  images: string[];
  upvotes: number;
  hasUserUpvoted: boolean;
  statusHistory: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
}

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [showReportSpam, setShowReportSpam] = useState(false);
  const [spamReason, setSpamReason] = useState('');

  useEffect(() => {
    // Mock data for demonstration
    const mockIssue: Issue = {
      id: id || '1',
      title: 'Pothole on Main Road',
      description: 'There is a large pothole on Main Road near the city center that is causing significant traffic issues. The pothole is approximately 2 feet wide and 6 inches deep, making it dangerous for vehicles, especially motorcycles and bicycles. It has been there for over a week and seems to be getting worse with each passing day.',
      category: 'Roads (potholes, obstructions)',
      status: 'Reported',
      location: 'Main Road, Near City Center',
      reportedAt: '2 hours ago',
      reportedBy: 'John Doe',
      isAnonymous: false,
      images: [],
      upvotes: 12,
      hasUserUpvoted: false,
      statusHistory: [
        {
          status: 'Reported',
          timestamp: '2 hours ago',
          note: 'Issue reported by citizen'
        }
      ]
    };
    setIssue(mockIssue);
  }, [id]);

  const handleUpvote = () => {
    if (!issue) return;
    setIssue(prev => prev ? {
      ...prev,
      upvotes: prev.hasUserUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
      hasUserUpvoted: !prev.hasUserUpvoted
    } : null);
  };

  const handleReportSpam = () => {
    if (!spamReason.trim()) {
      alert('Please select a reason for reporting this as spam.');
      return;
    }
    alert('Thank you for your report. We will review this issue.');
    setShowReportSpam(false);
    setSpamReason('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported': return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!issue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issue details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{issue.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">{issue.category}</span>
              <span>{issue.location}</span>
              <span>{issue.reportedAt}</span>
            </div>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(issue.status)}`}>
            {issue.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Images */}
          {issue.images.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Issue photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Status History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Status History</h2>
            <div className="space-y-3">
              {issue.statusHistory.map((entry, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{entry.status}</span>
                      <span className="text-sm text-gray-500">{entry.timestamp}</span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleUpvote}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  issue.hasUserUpvoted
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {issue.hasUserUpvoted ? 'Upvoted' : 'Upvote'} ({issue.upvotes})
              </button>
              
              <button
                onClick={() => setShowReportSpam(true)}
                className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Report Spam
              </button>
            </div>
          </div>

          {/* Issue Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Issue Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Reported by:</span>
                <p className="text-gray-600">
                  {issue.isAnonymous ? 'Anonymous' : issue.reportedBy}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <p className="text-gray-600">{issue.category}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p className="text-gray-600">{issue.location}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Reported:</span>
                <p className="text-gray-600">{issue.reportedAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Spam Modal */}
      {showReportSpam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Report as Spam</h3>
            <p className="text-gray-600 mb-4">Why are you reporting this issue?</p>
            
            <div className="space-y-2 mb-4">
              {['Spam or fake report', 'Irrelevant content', 'False information', 'Offensive content', 'Duplicate report'].map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="spamReason"
                    value={reason}
                    checked={spamReason === reason}
                    onChange={(e) => setSpamReason(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportSpam(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSpam}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetail;
