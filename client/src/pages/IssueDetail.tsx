import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIssueById, reportIssue } from "../services/issueService";
import { IIssue } from "../types";
import logger from "../utils/logger";

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<IIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportSpam, setShowReportSpam] = useState(false);
  const [spamReason, setSpamReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchIssue(id);
    }
  }, [id]);

  const fetchIssue = async (issueId: string) => {
    setLoading(true);
    try {
      const { data } = await getIssueById(issueId);
      setIssue(data);
    } catch (error) {
      logger.error('Error fetching issue', 'IssueDetail', { issueId, error });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = () => {
    // TODO: Implement upvote functionality
    logger.debug('Upvote action triggered', 'IssueDetail', { issueId: id });
  };

  const handleReportSpam = () => {
    if (!spamReason.trim()) {
      alert('Please provide a reason for reporting spam');
      return;
    }
    
    // Call the API to report spam
    if (id) {
      reportIssue(id, spamReason)
        .then(() => {
          alert('Issue reported as spam successfully');
          setShowReportSpam(false);
          setSpamReason('');
        })
        .catch((error) => {
          logger.error('Error reporting spam', 'IssueDetail', { issueId: id, error });
          alert('Failed to report spam. Please try again.');
        });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Issue not found</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto p-6 pt-24 sm:pt-28 relative z-10">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{issue.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Category: {issue.category || 'Unknown'}</span>
          <span>•</span>
          <span>Reported: {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}</span>
          {!issue.is_anonymous && issue.user?.username && (
            <>
              <span>•</span>
              <span>By: {issue.user.username}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Images */}
          {issue.images && issue.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issue.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Issue image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleUpvote}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span>👍</span>
                  <span>Upvote ({issue.upvotes?.length ?? 0})</span>
                </button>
              </div>
              <button
                onClick={() => setShowReportSpam(true)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                Report Spam
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Status</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
              issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {issue.status}
            </span>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <p className="text-gray-600">
              {Array.isArray(issue?.location?.coordinates) && issue.location.coordinates.length >= 2
                ? <>Lat: {Number(issue.location.coordinates[1]).toFixed(4)}, Lng: {Number(issue.location.coordinates[0]).toFixed(4)}</>
                : 'Location not available'}
            </p>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Activity Log</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Issue Reported</p>
                  <p className="text-sm text-gray-500">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Spam Modal */}
      {showReportSpam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Report Spam</h3>
            <textarea
              value={spamReason}
              onChange={(e) => setSpamReason(e.target.value)}
              placeholder="Why do you think this is spam or inappropriate?"
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowReportSpam(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSpam}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default IssueDetail;
