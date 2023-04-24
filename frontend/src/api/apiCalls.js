import {api, apiFlask} from "../plugins/http.js";
import {apiFetch} from "@/plugins/http2.js";

export const apiGetMarketNews = async () => {
    return (await api.get('/getMarketNews')).data;
};

export const apiGetTopGainers = async () => {
    return (await api.get('/getTopGainers')).data;
};

export const apiGetMajorIndexes = async () => {
    return (await api.get('/getMajorIndexes')).data;
};

export const apiGetNDaysTrendOfMajorIndexes = async (majorIndexes, numberOfDays) => {
    const queryString = majorIndexes.map(d => `symbols[]=${d}`).join('&');
    return (await api.get(`/getBarsMultipleSymbolsDaily?${queryString}&numberOfDays=${numberOfDays}`)).data;
};

export const apiGetStockSymbols = async () => {
    return (await api.get('/getStockSymbols')).data;
};

export const apiGetCompanyProfile = async (symbol) => {
    return (await api.get(`/getCompanyProfile?symbol=${symbol}`)).data;
};

export const apiGetAssetInfo = async (symbol) => {
    return (await api.get(`/getAssetInfo?symbol=${symbol}`)).data;
};

export const apiGetActiveAssets = async (exchange = 'NASDAQ') => {
    return (await api.get(`/getActiveAssets?exchange=${exchange}`)).data;
};

export const apiPyGetRiskAnalysis = async (symbols, startDate, endDate) => {
    const queryString = symbols.map(d => `symbols[]=${d}`).join('&');
    const queryString2 = `start_date=${startDate}&end_date=${endDate}`;
    return (await apiFlask.get(`/risk-analysis?${queryString}&${queryString2}`)).data;
};

export const apiGetBars = async (symbols, numberOfDays, timeframe, loadingState) => {
    const queryString = symbols.map(d => `symbols[]=${d}`).join('&');
    const url = `/getBarsMultipleSymbols?${queryString}&numberOfDays=${numberOfDays}&timeframe=${timeframe}`;
    const fetcher = apiFetch();
    return await fetcher.get(url, loadingState);
}



