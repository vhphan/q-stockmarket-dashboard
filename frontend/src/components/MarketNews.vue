<template>

    <div v-for="news in marketNews" :key="news.id">
        <news-item :news="news"/>
    </div>

</template>

<script setup>

import {onMounted} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import NewsItem from "@/components/NewsItem.vue";

const mainStore = useMainStore();
const {marketNews} = storeToRefs(mainStore);

onMounted(async () => {
    console.log('MarketNews mounted');
    await mainStore.fetchMarketNews();
});


</script>

<style scoped>

</style>