<script setup>

import {storeToRefs} from "pinia";
import {useMainStore} from "@/store/mainStore.js";
import {computed} from "vue";

const mainStore = useMainStore();
const {dateRange} = storeToRefs(mainStore);

if (dateRange.value.to === '' || dateRange.value.from === '') {
    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() - 180);
    end.setDate(end.getDate() - 1);
    dateRange.value = {
        from: start.toISOString().split('T')[0],
        to: end.toISOString().split('T')[0]
    };
}
const dateRangeToString = computed(() => {
    return dateRange.value.from + ' - ' + dateRange.value.to;
});


</script>

<template>
  <!--  date range picker model start and end date-->
        <q-input filled v-model="dateRangeToString">
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dateRange" range mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat/>
                            </div>
                        </q-date>
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>

</template>


<style scoped>

</style>