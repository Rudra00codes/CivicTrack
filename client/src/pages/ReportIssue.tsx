import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIssueActions } from "../hooks/useIssues";
import { validators } from "../utils/validation";
import { errorHandler } from "../utils/errorHandler";
import { compressImage } from "../utils/imageUtils";
import { sanitizeInput, validateFileUpload } from "../utils/security";
import { Input, Textarea, Select } from "../components/common/FormComponents";
import { useToastHelpers } from "../components/common/Toast";
import { Breadcrumb } from "../components/common/Navigation";
import logger from "../utils/logger";
import { 
  PhotoIcon, 
  MapPinIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from "@heroicons/react/24/outline";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { success, error: showError } = useToastHelpers();
  
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
    priority: 'medium',
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    isAnonymous: false
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [locationText, setLocationText] = useState('Zirakpur, SAS Nagar, Punjab 140603');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  // Set initial coordinates for Zirakpur to prevent location validation error
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: [76.8205, 30.6425] // Zirakpur coordinates [longitude, latitude]
      }
    }));
  }, []);

  const categories = [
    { value: 'Roads and Transportation', label: 'Roads and Transportation' },
    { value: 'Street Lighting', label: 'Street Lighting' },
    { value: 'Water Supply', label: 'Water Supply' },
    { value: 'Waste Management', label: 'Waste Management' },
    { value: 'Public Safety', label: 'Public Safety' },
    { value: 'Parks and Recreation', label: 'Parks and Recreation' },
    { value: 'Building and Construction', label: 'Building and Construction' },
    { value: 'Noise Complaints', label: 'Noise Complaints' },
    { value: 'Other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low - Minor inconvenience' },
    { value: 'medium', label: 'Medium - Needs attention' },
    { value: 'high', label: 'High - Safety concern' },
    { value: 'urgent', label: 'Urgent - Immediate danger' }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Report Issue', current: true }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'isAnonymous') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      // Sanitize input to prevent XSS
      const sanitizedValue = sanitizeInput(value);
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
      
      // Clear validation error when user starts typing
      if (validationErrors[name]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 5) {
      showError('You can upload a maximum of 5 images', 'Upload limit reached');
      return;
    }

    // Validate each file
    for (const file of files) {
      const validation = validateFileUpload(file);
      if (!validation.isValid) {
        showError(validation.error || 'Invalid file', 'Upload failed');
        return;
      }
    }

    try {
      // Compress images for better performance
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            return await compressImage(file, { quality: 0.8, maxWidth: 1920 });
          } catch (error) {
            logger.warn('Failed to compress image', 'Image Upload', { fileName: file.name, error });
            return file; // Use original if compression fails
          }
        })
      );
      
      setImages(prev => [...prev, ...compressedFiles]);
      success(`Added ${files.length} image${files.length > 1 ? 's' : ''}`, 'Upload successful');
    } catch (error) {
      logger.error('Failed to process images', 'Image Upload', error);
      showError('Failed to process images', 'Please try again');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    success('Image removed');
  };

  const validateForm = () => {
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

    return errors;
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

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showError('Please fix the errors below', 'Form validation failed');
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
          success('Location updated', 'GPS coordinates set successfully');
        },
        () => {
          showError('Unable to get your location', 'Please enter it manually');
        }
      );
    } else {
      showError('Geolocation not supported', 'Please enter location manually');
    }
  };

  const nextStep = () => {
    const errors = validateForm();
    const currentErrors = Object.keys(errors).filter(key => {
      if (currentStep === 1) return ['title', 'category', 'description'].includes(key);
      if (currentStep === 2) return ['location'].includes(key);
      return true;
    });

    if (currentErrors.length > 0) {
      const stepErrors: Record<string, string> = {};
      currentErrors.forEach(key => {
        stepErrors[key] = errors[key];
      });
      setValidationErrors(stepErrors);
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
    setValidationErrors({});
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setValidationErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
        <p className="text-gray-600">Help improve your community by reporting civic issues. Your report will be reviewed and forwarded to the appropriate authorities.</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Issue Details', icon: ExclamationTriangleIcon },
            { step: 2, label: 'Location & Photos', icon: MapPinIcon },
            { step: 3, label: 'Review & Submit', icon: CheckCircleIcon }
          ].map(({ step, label, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {label}
              </span>
              {step < 3 && (
                <div className={`ml-4 h-0.5 w-16 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Step 1: Issue Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Issue Details</h2>
              <p className="text-gray-600">Provide clear information about the issue you're reporting.</p>
            </div>

            <Input
              label="Issue Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief, descriptive title (e.g., 'Broken streetlight on Main St')"
              error={validationErrors.title}
              required
              maxLength={100}
            />

            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Select the type of issue"
              options={categories}
              error={validationErrors.category}
              required
            />

            <Select
              label="Priority Level"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              options={priorityOptions}
              hint="Help us prioritize your report appropriately"
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed information about the issue, including when you first noticed it, its impact on the community, and any other relevant details..."
              error={validationErrors.description}
              required
              rows={6}
              showCharCount
              maxLength={1000}
              hint="The more details you provide, the faster we can address the issue"
            />
          </div>
        )}

        {/* Step 2: Location & Photos */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Location & Photos</h2>
              <p className="text-gray-600">Help us locate the issue and provide visual evidence.</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <Input
                  name="location"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Enter address or landmark"
                  error={validationErrors.location}
                  leftIcon={<MapPinIcon className="h-5 w-5" />}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <MapPinIcon className="h-5 w-5" />
                  <span>Use GPS</span>
                </button>
              </div>
              {formData.location.coordinates[0] !== 0 && (
                <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Location set: {locationText}</span>
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (up to 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
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
                  <PhotoIcon className="h-12 w-12 mb-4 text-gray-400" />
                  <span className="text-lg font-medium mb-2">Upload Photos</span>
                  <span className="text-sm text-gray-500">
                    Click to browse or drag and drop images here
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    JPG, PNG, WebP up to 5MB each
                  </span>
                </label>
              </div>
              
              {validationErrors.images && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{validationErrors.images}</span>
                </p>
              )}

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Images ({images.length}/5)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                        <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                          {(image.size / 1024 / 1024).toFixed(1)}MB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
              <p className="text-gray-600">Please review your report before submitting.</p>
            </div>

            {/* Review Summary */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Issue Title</h3>
                <p className="text-gray-700">{formData.title}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Category & Priority</h3>
                <p className="text-gray-700">
                  {categories.find(cat => cat.value === formData.category)?.label} • 
                  <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                    formData.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    formData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {priorityOptions.find(p => p.value === formData.priority)?.label.split(' - ')[0]}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Description</h3>
                <p className="text-gray-700">{formData.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Location</h3>
                <p className="text-gray-700">{locationText || 'GPS coordinates set'}</p>
              </div>

              {images.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900">Photos ({images.length})</h3>
                  <div className="flex space-x-2 mt-2">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Anonymous Reporting */}
            <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <label htmlFor="isAnonymous" className="text-sm font-medium text-gray-900">
                  Submit anonymously
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Your identity will not be shared, but you won't receive status updates
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
