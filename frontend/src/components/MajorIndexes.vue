<template>
  <!--create a KPI card for each index in majorIndexes-->
  <!--  get the ClosePrice from DailyBar and PrevDailyBar-->
    <q-scroll-area
            class="justify-center"
            style="height: 200px;"
            visible
            ref="scrollAreaRef"
            :bar-style="barStyle"
            :thumb-style="thumbStyle"
    >
        <div
                class="row no-wrap justify-center"
        >
            <q-card class="q-pa-mxs q-mx-xs"
                    v-for="index in majorIndexes"
                    :key="index.symbol"
            >
                <q-card-section class="q-pa-xs">
                    <q-btn class="text-h6">{{ index.symbol }}

                        <q-popup-proxy>
                            <asset-info :symbol="index.symbol"/>
                        </q-popup-proxy>

                    </q-btn>
                </q-card-section>
                <q-item style="max-height: 100px; margin:0; padding: 0;">
                    <trend
                            :data="sparkLineData[index.symbol].map(d=>d['ClosePrice'])"
                            :width="150"
                            :height="50"
                            :gradient="[
                                '#e3f2fd',
                                '#bbdefb',
                                '#90caf9',
                                '#64b5f6',
                                '#42a5f5',
                                '#2196f3',
                                '#1e88e5',
                                '#1976d2',
                                '#1565c0',
                                '#0d47a1',
                                '#82b1ff',
                                '#448aff',
                                '#2979ff',
                                '#2962ff',
                                ]"
                            auto-draw
                            smooth
                    />
                </q-item>
                <q-card-section class="q-pa-xs">
                    <div class="row">
                        <div class="col">
                            <div class="text-h6">{{ index.DailyBar.ClosePrice }}</div>
                            <div class="text-subtitle2">
                                {{ index.DailyBar.ClosePrice > index.PrevDailyBar.ClosePrice ? '+' : '' }}{{
                                (index.DailyBar.ClosePrice - index.PrevDailyBar.ClosePrice).toFixed(2)
                                }}
                            </div>
                        </div>
                        <div class="col-auto">
                            <q-icon
                                    v-if="index.DailyBar.ClosePrice > index.PrevDailyBar.ClosePrice"
                                    name="trending_up" size="2.5rem"
                                    color="green"
                            />
                            <q-icon
                                    v-else
                                    name="trending_down" size="2.5rem"
                                    color="red"
                            />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </q-scroll-area>
    <q-dialog v-model="showDialog">
        <asset-info :symbol="selectedSymbol"/>
    </q-dialog>
</template>

<script setup>

import {computed, onMounted, ref, watch} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import Trend from "vue3trend";
import AssetInfo from "@/components/AssetInfo.vue";


const mainStore = useMainStore();
const {
    majorIndexes,
    symbolsOfMajorIndexes,
    NDaysTrendOfMajorIndexes
} = storeToRefs(mainStore);

watch(majorIndexes, async () => {
    console.log("majorIndexes changed");
    console.log(majorIndexes);
    await mainStore.fetchNDaysTrendOfMajorIndexes(90);
});

onMounted(async () => {
        await mainStore.fetchMajorIndexes();
    }
);

const sparkLineData = computed(() => {
    const results = {};
    symbolsOfMajorIndexes.value.forEach((symbol) => {
            results[symbol] = NDaysTrendOfMajorIndexes.value.filter(d => d.Symbol === symbol);
        }
    );
    return results;
});

// return {
//     spData1: (() => {
//         const len = 50
//         return Array.from({
//             length: len
//         }, () => Math.floor(Math.random() * len))
//     })(),
//     spIndicatorStyles1: false,
//     spLineStyles1: {
//         stroke: '#54a5ff'
//     }
// }

const spIndicatorStyles1 = false;
const spLineStyles1 = {
    stroke: '#54a5ff'
};

</script>

<style scoped>

</style>