/**
 * Help and Documentation System for better user guidance
 */

import { useState, useEffect } from 'react';
import { 
  QuestionMarkCircleIcon, 
  XMarkIcon, 
  ChevronRightIcon,
  BookOpenIcon,
  PlayIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface HelpItem {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  relatedItems?: string[];
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element highlighting
  action?: 'click' | 'input' | 'scroll' | 'wait';
  content: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TutorialStep[];
}

// Sample help content for CivicTrack
const helpItems: HelpItem[] = [
  {
    id: 'reporting-issue',
    title: 'How to Report an Issue',
    category: 'Getting Started',
    keywords: ['report', 'issue', 'problem', 'submit'],
    difficulty: 'beginner',
    estimatedTime: '2 minutes',
    content: `
      <h3>Reporting a Civic Issue</h3>
      <ol>
        <li>Navigate to the "Report Issue" page</li>
        <li>Select the type of issue from the dropdown</li>
        <li>Provide a clear, descriptive title</li>
        <li>Add detailed description of the problem</li>
        <li>Upload photos if available (recommended)</li>
        <li>Set the location using the map or address</li>
        <li>Choose the priority level</li>
        <li>Click "Submit Report"</li>
      </ol>
      <p><strong>Tip:</strong> The more details you provide, the faster the issue can be resolved!</p>
    `,
    relatedItems: ['issue-types', 'photo-guidelines']
  },
  {
    id: 'issue-types',
    title: 'Types of Issues You Can Report',
    category: 'Getting Started',
    keywords: ['types', 'categories', 'what', 'can', 'report'],
    difficulty: 'beginner',
    estimatedTime: '1 minute',
    content: `
      <h3>Reportable Issue Categories</h3>
      <ul>
        <li><strong>Infrastructure:</strong> Potholes, broken streetlights, damaged sidewalks</li>
        <li><strong>Sanitation:</strong> Overflowing bins, illegal dumping, unclean public areas</li>
        <li><strong>Traffic:</strong> Broken traffic lights, missing signs, dangerous intersections</li>
        <li><strong>Environment:</strong> Illegal construction, noise pollution, air quality</li>
        <li><strong>Public Safety:</strong> Broken fences, unsafe conditions, security concerns</li>
        <li><strong>Utilities:</strong> Water leaks, power outages, gas leaks</li>
      </ul>
    `,
    relatedItems: ['reporting-issue', 'priority-levels']
  },
  {
    id: 'photo-guidelines',
    title: 'Photo Guidelines for Reports',
    category: 'Best Practices',
    keywords: ['photo', 'image', 'upload', 'guidelines'],
    difficulty: 'beginner',
    estimatedTime: '2 minutes',
    content: `
      <h3>Taking Effective Photos</h3>
      <ul>
        <li><strong>Multiple angles:</strong> Take 2-3 photos from different perspectives</li>
        <li><strong>Good lighting:</strong> Ensure the issue is clearly visible</li>
        <li><strong>Context:</strong> Show surrounding area for location reference</li>
        <li><strong>Close-ups:</strong> Include detailed shots of the specific problem</li>
        <li><strong>File size:</strong> Keep images under 5MB each</li>
        <li><strong>Formats:</strong> Use JPG, PNG, or WebP formats</li>
      </ul>
      <p><strong>Note:</strong> Avoid including personal information or license plates in photos.</p>
    `,
    relatedItems: ['reporting-issue', 'privacy-policy']
  },
  {
    id: 'tracking-status',
    title: 'Tracking Your Report Status',
    category: 'Using the Platform',
    keywords: ['track', 'status', 'update', 'progress'],
    difficulty: 'beginner',
    estimatedTime: '1 minute',
    content: `
      <h3>Understanding Report Statuses</h3>
      <ul>
        <li><strong>Submitted:</strong> Your report is received and queued for review</li>
        <li><strong>Under Review:</strong> Authorities are evaluating the issue</li>
        <li><strong>In Progress:</strong> Work has begun to address the problem</li>
        <li><strong>Resolved:</strong> The issue has been fixed</li>
        <li><strong>Closed:</strong> No action needed or duplicate report</li>
      </ul>
      <p>You'll receive email notifications for status changes, and can always check your dashboard for updates.</p>
    `,
    relatedItems: ['dashboard-guide', 'notifications']
  }
];

const tutorials: Tutorial[] = [
  {
    id: 'first-report',
    title: 'Submit Your First Report',
    description: 'Learn how to report a civic issue step by step',
    category: 'Getting Started',
    estimatedTime: '5 minutes',
    difficulty: 'beginner',
    steps: [
      {
        id: 'step-1',
        title: 'Navigate to Report Page',
        description: 'Click on the "Report Issue" button in the navigation',
        target: '[href="/report-issue"]',
        action: 'click',
        content: 'First, we need to go to the report issue page. Click on the "Report Issue" link in the navigation menu.'
      },
      {
        id: 'step-2',
        title: 'Select Issue Type',
        description: 'Choose the category that best describes your issue',
        target: '#issue-type-select',
        action: 'click',
        content: 'Select the appropriate category from the dropdown. This helps route your report to the right department.'
      },
      {
        id: 'step-3',
        title: 'Add Title and Description',
        description: 'Provide clear details about the issue',
        target: '#issue-title',
        action: 'input',
        content: 'Write a clear, descriptive title and detailed description. The more information you provide, the better!'
      }
    ]
  }
];

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'tutorials' | 'faq'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);

  // Filter help items based on search and category
  const filteredItems = helpItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(helpItems.map(item => item.category)));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative flex h-full">
        <div className="ml-auto w-full max-w-4xl bg-white shadow-xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Help Center</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'articles', label: 'Help Articles', icon: DocumentTextIcon },
                  { id: 'tutorials', label: 'Tutorials', icon: PlayIcon },
                  { id: 'faq', label: 'FAQ', icon: ChatBubbleLeftRightIcon }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'articles' && (
                <div className="flex h-full">
                  {/* Sidebar */}
                  {!selectedItem && (
                    <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                      <div className="p-4 space-y-4">
                        {/* Search */}
                        <input
                          type="text"
                          placeholder="Search help articles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        {/* Category Filter */}
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Categories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      {/* Articles List */}
                      <div className="overflow-y-auto">
                        {filteredItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="w-full p-4 text-left hover:bg-white transition-colors border-b border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                            {item.difficulty && (
                              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                item.difficulty === 'beginner' 
                                  ? 'bg-green-100 text-green-800'
                                  : item.difficulty === 'intermediate'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.difficulty}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className={`${selectedItem ? 'w-full' : 'w-2/3'} p-6 overflow-y-auto`}>
                    {selectedItem ? (
                      <div>
                        <button
                          onClick={() => setSelectedItem(null)}
                          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <ChevronRightIcon className="h-4 w-4 rotate-180" />
                          <span>Back to articles</span>
                        </button>
                        
                        <div className="mb-4">
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h1>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{selectedItem.category}</span>
                            {selectedItem.estimatedTime && <span>• {selectedItem.estimatedTime}</span>}
                            {selectedItem.difficulty && (
                              <span className={`px-2 py-1 rounded-full ${
                                selectedItem.difficulty === 'beginner' 
                                  ? 'bg-green-100 text-green-800'
                                  : selectedItem.difficulty === 'intermediate'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {selectedItem.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div 
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select an article to read</h3>
                        <p className="text-gray-500">Choose from the help articles on the left to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'tutorials' && (
                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {tutorials.map(tutorial => (
                      <div key={tutorial.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <PlayIcon className="h-6 w-6 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{tutorial.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{tutorial.estimatedTime}</span>
                              <span>• {tutorial.steps.length} steps</span>
                              <span className={`px-2 py-1 rounded-full ${
                                tutorial.difficulty === 'beginner' 
                                  ? 'bg-green-100 text-green-800'
                                  : tutorial.difficulty === 'intermediate'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {tutorial.difficulty}
                              </span>
                            </div>
                            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">
                              Start Tutorial →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      {[
                        {
                          question: "How long does it take for issues to be resolved?",
                          answer: "Resolution times vary depending on the type and severity of the issue. Most minor issues are addressed within 3-5 business days, while complex infrastructure problems may take several weeks."
                        },
                        {
                          question: "Can I report issues anonymously?",
                          answer: "Yes, you can submit reports without creating an account, but you won't be able to track the status or receive updates about your report."
                        },
                        {
                          question: "What happens after I submit a report?",
                          answer: "Your report is reviewed by our team and forwarded to the appropriate municipal department. You'll receive status updates via email if you provided contact information."
                        }
                      ].map((faq, index) => (
                        <details key={index} className="bg-gray-50 rounded-lg p-4">
                          <summary className="cursor-pointer font-medium text-gray-900 hover:text-blue-600">
                            {faq.question}
                          </summary>
                          <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Help Button Component
interface HelpButtonProps {
  className?: string;
}

export const HelpButton = ({ className = '' }: HelpButtonProps) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsHelpOpen(true)}
        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
        aria-label="Open help center"
      >
        <QuestionMarkCircleIcon className="h-5 w-5" />
        <span>Help</span>
      </button>
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};
