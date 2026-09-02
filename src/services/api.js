import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, 
});

const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register/aluno', '/auth/refresh'];

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    const isPublic = PUBLIC_ENDPOINTS.some((path) => config.url.includes(path));

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        // Verifica status 401 ou 403
        if (
            (error.response?.status === 401 || error.response?.status === 403) && 
            !originalRequest._retry && 
            !originalRequest.url.includes('/auth/login') && 
            !originalRequest.url.includes('/auth/refresh')
        ) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await api.post('/auth/refresh');
                const { accessToken } = refreshResponse.data;

                localStorage.setItem('accessToken', accessToken);
                
                processQueue(null, accessToken);

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                processQueue(refreshError, null);
                
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userRole');
                
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;