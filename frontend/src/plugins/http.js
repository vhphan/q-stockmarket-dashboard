import axios from 'axios';
import {colorTrace} from "@/utils/myFunctions.js";
import {triggerNegative, triggerInfo} from "@/utils/notifications.js";

function createInstance(baseURL) {
    let headers = {
        'Content-Type': 'application/json',
    };
    console.log('isProduction', import.meta.env.PROD);
    return axios.create({
        baseURL,
        headers,
    });
}

const addInterceptor = (instance) => {

    instance.interceptors.request.use((config) => {
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    instance.interceptors.response.use(function (response) {
        if (!response.data.success && import.meta.env.DEV) {
            triggerInfo(
                {message: `Success indicator is false or missing. URL: ${response.config.url}`}
            );
        }
        return response;
    }, function (error) {
        const errObj = error.toJSON();
        colorTrace(error, 'red');
        triggerNegative({
            message: errObj.message,
            position: 'center',
        });
        const {response} = error;
        if (!response) return Promise.reject(error);

        const errorMessage = response.data?.message || error.statusText;

        triggerNegative({
            message: errorMessage,
        });

        if (response.status !== 200) {
            triggerNegative({
                message: `Something went wrong. Status code ${response.status} ${response.statusText}`,
            });
        }
        return Promise.reject(error);
    });

    return instance;

};


export function getBaseUrl() {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_BASE_URL_PROD_NODE;
    }
    return import.meta.env.VITE_API_BASE_URL_DEV_NODE;
}

export function getBaseUrlFlask() {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_BASE_URL_PROD_FLASK;
    }
    return import.meta.env.VITE_API_BASE_URL_DEV_FLASK;
}

const BASE_URL_NODE = getBaseUrl();
const BASE_URL_FLASK = getBaseUrlFlask();
const api = addInterceptor(createInstance(BASE_URL_NODE + '/api/v1'));
const apiFlask = addInterceptor(createInstance(BASE_URL_FLASK + '/api/v1'));

export {
    api,
    apiFlask
};