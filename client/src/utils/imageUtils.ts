/**
 * Image optimization utilities for performance
 */

// Image compression options
interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

/**
 * Compress image file for optimal upload performance
 */
export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Canvas to blob conversion failed'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create image thumbnail for preview
 */
export const createThumbnail = (
  file: File,
  size: number = 150
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;

      const { width, height } = img;
      const aspectRatio = width / height;
      
      let drawWidth = size;
      let drawHeight = size;
      let offsetX = 0;
      let offsetY = 0;

      if (aspectRatio > 1) {
        drawWidth = size * aspectRatio;
        offsetX = (size - drawWidth) / 2;
      } else {
        drawHeight = size / aspectRatio;
        offsetY = (size - drawHeight) / 2;
      }

      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };

    img.onerror = () => reject(new Error('Thumbnail creation failed'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file
 */
export const validateImage = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 10MB'
    };
  }

  return { isValid: true };
};

/**
 * Lazy load image with intersection observer
 */
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  placeholder?: string
): void => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          image.src = src;
          image.onload = () => {
            image.classList.add('loaded');
          };
          observer.unobserve(image);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (placeholder) {
    img.src = placeholder;
  }
  
  img.classList.add('lazy-image');
  observer.observe(img);
};

/**
 * Generate responsive image URLs for different screen sizes
 */
export const generateResponsiveUrls = (baseUrl: string) => {
  return {
    small: `${baseUrl}?w=400&q=75`,
    medium: `${baseUrl}?w=800&q=80`,
    large: `${baseUrl}?w=1200&q=85`,
    original: baseUrl
  };
};
