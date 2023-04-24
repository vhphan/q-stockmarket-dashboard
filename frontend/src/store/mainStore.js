import {defineStore} from 'pinia';
import {useStorage} from '@vueuse/core';
import {
    apiGetActiveAssets, apiGetBars,
    apiGetMajorIndexes,
    apiGetMarketNews,
    apiGetNDaysTrendOfMajorIndexes,
    apiGetStockSymbols,
    apiGetTopGainers,
    apiPyGetRiskAnalysis
} from "@/api/apiCalls.js";
import {getNDaysAgoDateString} from "@/utils/myFunctions.js";

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        loading: false,
        marketNews: [],
        topGainers: [],
        majorIndexes: [],
        symbolsOfMajorIndexes: [],
        NDaysTrendOfMajorIndexes: [],
        stockSymbols: [],
        selectedStockSymbol: '',
        selectedStockSymbols: useStorage('selectedStockSymbols', []),
        activeAssets: [],
        selectedAssets: useStorage('selectedAssets', []),
        dateRange: useStorage('dateRange', {
            from: getNDaysAgoDateString(180),
            to: getNDaysAgoDateString(1),
        }),
        riskAnalysis: [],
    }),

    actions: {
        async addLoader(func) {
            try {
                this.loading = true;
                await func();
            } finally {
                this.loading = false;
            }
        },
        async addLoaderArgs(func, ...args) {
            try {
                this.loading = true;
                await func(...args);
            } finally {
                this.loading = false;
            }
        },
        async fetchMarketNews() {
            this.marketNews = (await apiGetMarketNews()).data;
        },
        async fetchTopGainers() {
            this.topGainers = (await apiGetTopGainers()).data;
        },
        async fetchMajorIndexes() {
            this.majorIndexes = (await apiGetMajorIndexes()).data;
            this.symbolsOfMajorIndexes = this.majorIndexes.map(d => d.symbol);
        },
        async fetchNDaysTrendOfMajorIndexes(numberOfDays) {
            if (this.majorIndexes.length === 0) {
                await this.fetchMajorIndexes();
            }
            if (this.majorIndexes.length === 0) {
                return;
            }
            this.NDaysTrendOfMajorIndexes = (await apiGetNDaysTrendOfMajorIndexes(this.majorIndexesSymbols, numberOfDays)).data;
        },
        async fetchStockSymbols() {
            this.stockSymbols = (await apiGetStockSymbols()).data?.sort((a, b) => {
                const textA = a.symbol.toUpperCase();
                const textB = b.symbol.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        },
        async fetchActiveAssets(exchange = 'NASDAQ') {
            this.activeAssets = (await apiGetActiveAssets(exchange)).data?.sort((a, b) => {
                const textA = a.value.toUpperCase();
                const textB = b.value.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        },
        async fetchRiskAnalysis() {
            const symbols = this.selectedStockSymbols.map(d => d.symbol);
            this.riskAnalysis = (await apiPyGetRiskAnalysis(symbols, this.dateRange.from, this.dateRange.to)).data;
        },
        // symbol, numberOfDays, timeframe, loadingState
        async fetchBars(){
            const symbols = this.selectedStockSymbols.map(d => d.symbol);
            await apiGetBars(symbols, 180, '1D', this.loading);
        }

    },
    getters: {
        topGainersColumns: (state) => {
            if (state.topGainers.length === 0) {
                return [];
            }
            return Object.keys(state.topGainers[0]).map(d => ({
                    name: d,
                    label: d,
                    field: d,
                })
            );
        },
        majorIndexesSymbols: (state) => {
            if (state.majorIndexes.length === 0) {
                return [];
            }
            return state.majorIndexes.map(d => d.symbol);
        }
    }
});