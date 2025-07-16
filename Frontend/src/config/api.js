// Get the current window location to determine the API URL
const getApiBaseUrl = () => {
  // Always use the EC2 production IP - no localhost fallback
  return 'http://3.94.196.83:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to get full URL for images/static files
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}/${imagePath}`;
};