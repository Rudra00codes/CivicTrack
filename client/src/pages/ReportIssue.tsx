import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIssueActions } from "../hooks/useIssues";
import { validators } from "../utils/validation";
import { errorHandler } from "../utils/errorHandler";
import { compressImage } from "../utils/imageUtils";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  // Use the modular issue actions hook
  const { 
    loading: isSubmitting, 
    createNewIssue, 
    clearError 
  } = useIssueActions();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    isAnonymous: false
  });
  const [images, setImages] = useState<File[]>([]);
  const [locationText, setLocationText] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const categories = [
    'Roads',
    'Lighting', 
    'Water Supply',
    'Cleanliness',
    'Public Safety',
    'Obstructions'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'isAnonymous') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    // Clear previous errors
    clearError();
    setValidationErrors({});

    // Validate form data using modular validators
    const titleValidation = validators.issueTitle(formData.title);
    const descriptionValidation = validators.issueDescription(formData.description);
    const categoryValidation = validators.issueCategory(formData.category);

    const errors: Record<string, string> = {};
    
    if (!titleValidation.isValid) {
      errors.title = titleValidation.errors[0];
    }
    if (!descriptionValidation.isValid) {
      errors.description = descriptionValidation.errors[0];  
    }
    if (!categoryValidation.isValid) {
      errors.category = categoryValidation.errors[0];
    }

    // Check location
    if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
      errors.location = 'Please set your location';
    } else {
      const [lng, lat] = formData.location.coordinates;
      const coordValidation = validators.coordinates(lat, lng);
      if (!coordValidation.isValid) {
        errors.location = 'Invalid location coordinates';
      }
    }

    // Validate images if any
    if (images.length > 0) {
      const imageValidation = validators.imageFiles(images);
      if (!imageValidation.isValid) {
        errors.images = imageValidation.errors[0];
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      // Compress images before upload
      const compressedImages = await Promise.all(
        images.map(img => compressImage(img))
      );
      
      // Convert images to base64 for demo (in production, upload to cloud storage)
      const imageUrls = await Promise.all(
        compressedImages.map(img => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(img);
          });
        })
      );

      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        images: imageUrls,
        is_anonymous: formData.isAnonymous
      };

      const success = await createNewIssue(issueData);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      errorHandler.logError(err as Error, 'Issue Creation Form');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }));
          setLocationText(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        () => {
          alert('Unable to get your location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report an Issue</h1>
        <p className="text-gray-600">Help improve your community by reporting civic issues.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Issue Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Brief description of the issue"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide more details about the issue"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="location"
              name="location"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Enter location or use GPS"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              📍 GPS
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos (up to 5)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm">Click to upload photos</span>
            </label>
          </div>
          
          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anonymous Reporting */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
            Report anonymously
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
