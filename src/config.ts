// API configuration
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

// Helper function to construct full API URLs
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Export for backward compatibility
export default {
  API_BASE_URL,
  getApiUrl
};
