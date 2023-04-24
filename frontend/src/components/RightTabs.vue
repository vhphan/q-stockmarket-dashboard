<template>
    <div class="q-pa-md">
        <div class="q-gutter-y-md">
            <q-card>
                <q-tabs
                        v-model="tab"
                        dense
                        class="text-grey"
                        active-color="primary"
                        indicator-color="primary"
                        align="justify"
                        narrow-indicator

                >
                    <q-tab v-for="tab in tabs" :key="tab.name"
                           :label="tab.label"
                           :name="tab.name"
                    />
                </q-tabs>

                <q-separator/>

                <q-tab-panels keep-alive v-model="tab" animated>
                    <q-tab-panel
                            v-for="tab in tabs"
                            :key="tab.name"
                            :name="tab.name"
                            :style="`height: ${containerHeight}`"
                    >
                        <component :is="tab.componentName"></component>
                    </q-tab-panel>
                </q-tab-panels>

            </q-card>

        </div>
    </div>
</template>

<script>
import {computed, ref} from 'vue';
import Section1 from "@/sections/Section1.vue";
import Section2 from "@/sections/Section2.vue";

export default {
    components: {Section1, Section2},

    setup() {

        const tab = ref('section1');
        const tabs = [
            {
                name: 'section1',
                label: 'Candlestick Chart',
                componentName: 'Section1'
            },
            {
                name: 'section2',
                label: 'Returns / Sharpe Ratio',
                componentName: 'Section2'
            },
        ];
        const toolBarHeight = computed(() => {
            return document.querySelector('.q-toolbar').clientHeight;
        });
        const containerHeight = computed(() => {
            return `calc(100vh - ${toolBarHeight.value}px - 90px)`
        });
        return {
            tab,
            tabs,
            containerHeight
        };
    }
}
;
</script>
<style scoped>

</style>