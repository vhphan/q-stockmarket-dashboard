import {api} from "../plugins/http.js";

// export const apiGetRegionalCountTrend = async () => {
//     const response = (await api.get(`/regionalCountTrend`)).data;
//     return response.data;
// };

export const apiCheckConnection = async () => {
    return (await api.get('/')).data;
};

export const apiGetMarketNews = async () => {
    return (await api.get('/getMarketNews')).data;
};

export const apiGetTopGainers = async () => {
    return (await api.get('/getTopGainers')).data;
};

export const apiGetMajorIndexes = async () => {
    return (await api.get('/getMajorIndexes')).data;
}