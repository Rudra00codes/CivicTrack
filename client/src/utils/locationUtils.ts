/**
 * Geolocation and distance calculation utilities
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationResult {
  success: boolean;
  coordinates?: Coordinates;
  error?: string;
}

/**
 * Geolocation utilities with proper error handling
 */
export const locationUtils = {
  /**
   * Gets the user's current location with enhanced error handling
   */
  getCurrentLocation: (options?: PositionOptions): Promise<LocationResult> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          success: false,
          error: 'Geolocation is not supported by this browser'
        });
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            success: true,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          resolve({
            success: false,
            error: errorMessage
          });
        },
        defaultOptions
      );
    });
  },

  /**
   * Calculates distance between two coordinates using Haversine formula
   */
  calculateDistance: (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = coord1.lat * Math.PI / 180;
    const φ2 = coord2.lat * Math.PI / 180;
    const Δφ = (coord2.lat - coord1.lat) * Math.PI / 180;
    const Δλ = (coord2.lng - coord1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },

  /**
   * Filters issues by distance from a given location
   */
  filterByDistance: (issues: any[], userLocation: Coordinates, maxDistance: number): any[] => {
    return issues.filter(issue => {
      if (!issue.location?.coordinates) return false;
      
      const issueLocation: Coordinates = {
        lat: issue.location.coordinates[1], // GeoJSON format: [lng, lat]
        lng: issue.location.coordinates[0]
      };
      
      const distance = locationUtils.calculateDistance(userLocation, issueLocation);
      return distance <= maxDistance;
    });
  },

  /**
   * Formats distance for display
   */
  formatDistance: (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  },

  /**
   * Default coordinates for major cities (fallback)
   */
  defaultLocations: {
    delhi: { lat: 28.6139, lng: 77.2090 },
    mumbai: { lat: 19.0760, lng: 72.8777 },
    bangalore: { lat: 12.9716, lng: 77.5946 },
    chennai: { lat: 13.0827, lng: 80.2707 },
    kolkata: { lat: 22.5726, lng: 88.3639 }
  } as const
};
