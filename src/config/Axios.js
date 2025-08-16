export const Request = async (endpoint, options = {}) => {

  // const url = `${process.env.NEXT_PUBLIC_BACKEND_PUBLIC_BASE_URL}/api${endpoint}`;
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_BASE_URL || "https://king-prawn-app-tflmf.ondigitalocean.app";
  const URL = `${API_URL}/api${endpoint}`;

  try {
    const response = await fetch(URL, {
      method: 'GET',
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    });
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
