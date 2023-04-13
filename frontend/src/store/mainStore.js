import {defineStore} from 'pinia';
import {
    apiGetMajorIndexes,
    apiGetMarketNews,
    apiGetNDaysTrendOfMajorIndexes,
    apiGetTopGainers
} from "@/api/apiCalls.js";

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        marketNews: [],
        topGainers: [],
        majorIndexes: [],
        symbolsOfMajorIndexes: [],
        NDaysTrendOfMajorIndexes: [],
    }),
    actions: {
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