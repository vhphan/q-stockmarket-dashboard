<template>
    <div class="q-pa-md">
        <q-select
                filled
                v-model="selectedStockSymbol"
                single
                :options="options"
                label="Select Symbol"
                @filter="filterFn"
                map-options
                input-debounce="1000"
                :option-label="labelFunc"
                option-value="symbol"
                use-input
                outlined
                :display-value="selectedStockSymbol?.symbol"
        />
    </div>
</template>

<script setup>
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {onMounted, ref} from "vue";

const mainStore = useMainStore();
const {selectedStockSymbol, stockSymbols} = storeToRefs(mainStore);
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