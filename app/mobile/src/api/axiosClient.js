import axios from 'axios';
import { getTranslation } from '../i18n/translate';
import { showToast } from '../utils/ToastService';

const axiosClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const customErrorMessage = error.config?.errorMessage;

        if (customErrorMessage) {
            showToast(getTranslation('error'), 'error', getTranslation(customErrorMessage));
            return Promise.reject(error);
        }

        if (!error.config?.skipGlobalErrorHandler) {
            const status = error.response ? error.response.status : null;
            let fallbackKey = 'api_error_general';

            if (status === 401) fallbackKey = 'error_401';
            else if (status === 403) fallbackKey = 'error_403';
            else if (status === 404) fallbackKey = 'error_404';
            else if (status >= 500) fallbackKey = 'error_500';

            showToast(getTranslation('error'), 'error', getTranslation(fallbackKey));
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
