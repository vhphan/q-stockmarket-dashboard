import axios from 'axios';
import {colorTrace} from "@/utils/myFunctions.js";
import {triggerInfo, triggerNegative} from "@/utils/notifications.js";


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
        // config.params = config.params ? {...config.params, ...{version: import.meta.env.VITE_HTTP_VERSION}} : {version: import.meta.env.VITE_HTTP_VERSION};
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    instance.interceptors.response.use(function (response) {
        // if (!response.data.success) {
        //     triggerInfo(
        //         {message: 'Success indicator is false or missing.'}
        //     );
        // }
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
        if (response.data && response.data.message) {
            triggerNegative({
                message: response.data.message,
            });
        }
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


function getBaseUrl() {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_BASE_URL_PROD_NODE;
    }
    return import.meta.env.VITE_API_BASE_URL_DEV_NODE;
}

const BASE_URL = getBaseUrl();
const api = addInterceptor(createInstance(BASE_URL + '/api/v1'));

export {api};