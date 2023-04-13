<template>
  <!--create a KPI card for each index in majorIndexes-->
  <!--  get the ClosePrice from DailyBar and PrevDailyBar-->
    <div class="row justify-around">
        <div
                v-for="index in majorIndexes"
        >
            <q-card class="col-2">
                <q-card-section>
                    <div class="text-h6">{{ index.symbol }}</div>
                </q-card-section>
                <q-card-section>
                    <div class="row">
                        <div class="col">
                            <div class="text-h6">{{ index.DailyBar.ClosePrice }}</div>
                            <div class="text-subtitle2">{{ index.PrevDailyBar.ClosePrice }}</div>
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
    </div>
</template>

<script setup>

import {onMounted} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();
const {majorIndexes} = storeToRefs(mainStore);


onMounted(async () => {
        await mainStore.fetchMajorIndexes();
    }
);


</script>

<style scoped>

</style>