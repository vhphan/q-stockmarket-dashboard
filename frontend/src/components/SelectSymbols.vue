<template>
        <q-select
                filled
                v-model="selectedStockSymbols"
                multiple
                :options="options"
                label="Select Symbol(s)"
                @filter="filterFn"
                input-debounce="1000"
                :option-label="labelFunc"
                option-value="symbol"
                use-input
                clearable
                outlined
                :display-value="selectedStockSymbols.map(s=>s.symbol).join(', ')"
                
        />
</template>

<script setup>
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {onMounted, ref} from "vue";

const mainStore = useMainStore();
const {selectedStockSymbols, stockSymbols} = storeToRefs(mainStore);
const options = ref(stockSymbols.value);

onMounted(async () => {
        await mainStore.fetchStockSymbols();
    }
);

const filterFn = (val, update) => {

    if (val === '') {
        update(() => {
            options.value = stockSymbols.value;
        });
        return;
    }

    update(() => {
        const needle = val.toLowerCase();
        options.value = stockSymbols.value.filter(v => {
            return v.symbol.toLowerCase().indexOf(needle) > -1;
        });
    });

};

const labelFunc = (option) => {
    if (!option || !option.symbol || !option.description ) return '';
    return option.symbol + ' - ' + option.description;
};

</script>

<style scoped>

</style>