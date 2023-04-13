<template>
    <div>
        <q-table
                :rows="topGainers"
                :columns="topGainersColumns"
                row-key="Symbol"
                selection="single"
                v-model:selected="selected"
                :pagination.sync="pagination"
                :loading="loading"
                :selected-rows-label="$q.lang.table.selectedRows"
                :selection-label="$q.lang.table.rowsSelected"
                binary-state-sort
                :rows-per-page-options="[5, 10, 15]"
                :rows-per-page-label="$q.lang.table.rowsPerPage"
                :pagination-label="$q.lang.table.page"
                :loading-label="$q.lang.table.loading"
                :no-data-label="$q.lang.table.noData"
                :no-results-label="$q.lang.table.noResults"
        />


    </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();
const {topGainers, topGainersColumns} = storeToRefs(mainStore);
const loading = ref(false);
const selected = ref([]);
async function fetchTopGainers() {
    try {
        loading.value = true;
        await mainStore.fetchTopGainers();
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await fetchTopGainers();
});

const pagination = {
    page: 1,
    rowsPerPage: 10
};

</script>

<style scoped>

</style>