<template>
    <div class="q-pa-md">
        <div class="q-gutter-y-md" style="max-width: 600px">
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
                           :label="tab.name"
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
import MarketNews from "@/components/MarketNews.vue";
import TopGainers from "@/components/TopGainers.vue";

export default {
    components: {TopGainers, MarketNews},

    setup() {

        const tab = ref('marketNews');
        const tabs = [
            {
                name: 'marketNews',
                label: 'Market News',
                componentName: 'MarketNews'
            }, {
                name: 'topGainers',
                label: 'Top Gainers',
                componentName: 'TopGainers'
            }
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