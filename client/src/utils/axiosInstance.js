import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Use env var or default to local
    withCredentials: true, // Important for sending cookies
});

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 Token Expiry
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't already retried
        if (error.response && error.response.status === 401 && !originalRequest._retry) {

            // Prevent infinite loops if the refresh endpoint itself fails
            if (originalRequest.url.includes('/api/auth/refresh-token')) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                // NOTE: Using raw axios here to avoid interceptors loop, or simple fetch if preferred, 
                // but utilizing the same baseURL context is easier with the instance provided we handle the loop check above.
                // Better to use a separate clean axios call or just this instance with loop protection.

                // Let's use the instance but reliance on the loop protection 'originalRequest.url' check is key.
                // Or better: use a completely separate axios call for refresh to be safe.
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`, {}, {
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    // Update local storage with new access token
                    const newToken = response.data.token;
                    localStorage.setItem('token', newToken);

                    // Update header for the original request
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                    // Update header for future requests (axios instance defaults)
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                    // Retry original request
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Session expired, please log in again.', refreshError);
                // Clear storage and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
