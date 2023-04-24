import {getBaseUrl, getBaseUrlFlask} from "@/plugins/http.js";
import {createFetch, useFetch} from "@vueuse/core";
import {colorTrace} from "@/utils/myFunctions.js";
import {triggerNegative} from "@/utils/notifications.js";

class MyFetch {
    constructor(baseUrl) {

        this.baseUrl = baseUrl;
        this.useFetchOptions = {

            onFetchError(ctx) {
                // ctx.data can be null when 5xx response
                console.error(ctx);
                return ctx;
            },

        };

        this.myUseFetch = createFetch({

            baseUrl,
            options: this.useFetchOptions,
            mode: 'cors',
            immediate: false,

        });

        this.loading = false;

    }

    errorHandling(error, statusCode) {

        const errObj = error.toJSON();

        colorTrace(error, 'red');

        triggerNegative({
            message: errObj.message,
            position: 'center',
        });

        const errorMessage = data.data?.message || error.statusText;

        triggerNegative({
            message: errorMessage,
        });

        if (statusCode !== 200) {
            triggerNegative({
                message: `Something went wrong. Status code ${statusCode}`,
            });
        }

    }

    async get(url) {

        let fetcher = this.myUseFetch(url, {});

        const {
            statusCode,
            abort,
            canAbort,
            isFetching,
            error,
            data,
        } = fetcher.get().json();

        this.loading = isFetching;

        debugger;

        if (error.value) {
            this.errorHandling(error.value, statusCode.value);
        }

        return {abort, canAbort, isFetching, error, data};

    }

}

const BASE_URL_NODE = getBaseUrl();
const BASE_URL_FLASK = getBaseUrlFlask();

export const apiFetch = () => new MyFetch(BASE_URL_NODE + '/api/v1');
export const apiFlaskFetch = () => new MyFetch(BASE_URL_FLASK + '/api/v1');

