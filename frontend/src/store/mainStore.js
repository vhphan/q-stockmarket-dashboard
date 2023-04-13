import {defineStore} from 'pinia';
import {apiGetMajorIndexes, apiGetMarketNews, apiGetTopGainers} from "@/api/apiCalls.js";

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        marketNews: [],
        topGainers: [],
        majorIndexes: [],
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
            }));
        }
    }
});