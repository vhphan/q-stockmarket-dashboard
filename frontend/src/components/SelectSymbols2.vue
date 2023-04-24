<template>
    <div class="q-pa-xs">
        <q-select
                filled
                v-model="selectedAssets"
                multiple
                :options="options"
                label="Select Symbols"
                @filter="filterFn"
                map-options
                input-debounce="1000"
                use-input
                outlined
                :display-value="selectedAssets.map(d=>d.value)"
        />
    </div>
</template>

<script>
import {computed, onMounted, ref} from "vue";
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";

export default {
    name: "SelectSymbols",
    setup() {

        const mainStore = useMainStore();
        const {activeAssets, selectedAssets} = storeToRefs(mainStore);
        const options = ref(activeAssets.value);

        const filterFn = (val, update) => {

            if (val === '') {
                update(() => {
                    options.value = activeAssets.value;
                });
                return;
            }

            update(() => {
                const needle = val.toLowerCase();
                options.value = activeAssets.value.filter(v => {
                    return v.value.toLowerCase().indexOf(needle) > -1;
                });
            });

        };

        onMounted(async () => {
                await mainStore.fetchActiveAssets('NASDAQ');
            }
        );

        return {
            options,
            filterFn,
            activeAssets,
            selectedAssets,
        };
    }
};
</script>

<style scoped>

</style>