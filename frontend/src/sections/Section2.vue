<script setup>
import SelectSymbols from "@/components/SelectSymbols.vue";
import SelectDateRange from "@/components/SelectDateRange.vue";
import {useMainStore} from "@/store/mainStore.js";

const mainStore = useMainStore();

const calculateRiskAnalysis = () => {
    // mainStore.fetchRiskAnalysis();
    mainStore.fetchBars();
};

</script>


<template>
    <div class="row">
        <select-symbols class="col-8"/>
        <select-date-range class="col-4"/>
        <q-btn
            @click="calculateRiskAnalysis"
            glossy
            outline
            color="primary"
            class="col-4"

        >
            Calculate Risk Analysis
        </q-btn>
    </div>
</template>


<style scoped>

</style>