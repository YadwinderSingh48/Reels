import axios from 'axios';
import { BASE_URL, REFRESH_TOKEN } from './API';
import { token_storage } from './storage';
import { Alert } from 'react-native';
import { resetAndNavigate } from '../utils/NavigationUtils';

// Create and axios instance or config to use for all requests 
export const AppAxios = axios.create({
    baseURL: BASE_URL
});

// set the token as an Authorization header if it is available in the storage 
AppAxios.interceptors.request.use(async config =>{
    const access_token = token_storage.getString('access_token');
    if(access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
    };
    return config;
});

// adding the interceptor or middlware in the axios request so that it can detech the unauthorized requestes and refresg the token and try again 
AppAxios.interceptors.response.use(
    response => response, 
    async error => {
        if(error?.response && error?.response?.status === 401) {
                try {
                    const newAccessToken = await refreshToken();
                    if(newAccessToken) {
                        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axios(error.config)
                    }
                } catch(error) {
                    console.log("Error Refreshing token", error);
                }
        };

        if(error?.response && error?.response?.status !==401) {
            const errorMessage = error?.response?.data?.msg || 'Something went wrong';
            Alert.alert("ERROR ", errorMessage);
        }
        return Promise.reject(error)
    }
    );


    // logic to refresh the token
    export const refreshToken = async () => {
            try {
                const refresh_token = token_storage.getString('refresh_token');
                const response = await axios.post(REFRESH_TOKEN, {
                    refresh_token,
                });

                const new_access_token = response.data.access_token;
                const new_refresh_token = response.data.refresh_token;
                token_storage.set('access_token', new_access_token);
                token_storage.set('refresh_token', new_refresh_token);

                return new_access_token;

            } catch(error) {
                console.log("Refresh token error");
                token_storage.clearAll();
                resetAndNavigate('LoginScreen');
                Alert.alert("Login Error","Unable to log you in Please try later")
            }
    }